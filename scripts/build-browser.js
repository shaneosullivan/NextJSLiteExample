const { exec, execSync } = require("child_process");
const fs = require("fs");
var watch = require("node-watch");

var rootDir = __dirname.replace("/scripts", "");

var excludedDirs = ["tmp", "public", "scripts", "node_modules", "styles"].map(
  (dir) => rootDir + "/" + dir
);

var shouldWatch = process.argv.some((arg) => arg === "--watch");
var shouldMinify = process.argv.some((arg) => arg === "--minify");

var outputDir =
  process.argv.find((arg, idx, args) => {
    if (idx === 0) {
      return false;
    }
    var prevArg = args[idx - 1];
    if (prevArg === "--dest") {
      if (arg.indexOf("--") === 0) {
        throw new Error(
          "No value provided for --dest, you must specify a folder name, e.g. --dest public/js"
        );
      }
      outputDir = args[idx + 1];
      return true;
    }
  }) || "public/js";

var isRunning = false;
var buildIsPending = false;

// List of the files to transpile per page. They're all in the /browser folder.
const pageCode = fs
  .readdirSync(`${rootDir}/browser`)
  .filter((file) => {
    return (
      file.indexOf(".ts") === file.length - 3 ||
      file.indexOf(".tsx") === file.length - 4
    );
  })
  .map((fileName) => {
    const idx = fileName.lastIndexOf(".");
    return {
      name: fileName.substring(0, idx),
      ext: fileName.substring(idx + 1),
    };
  });

function ensureDir() {
  try {
    // First make sure that the directories we need exist
    execSync(`mkdir -p ${rootDir}/tmp && mkdir -p ${rootDir}/${outputDir}`);
    return true;
  } catch (err) {
    console.error("Mkdir error", err.stdout.toString());
    return false;
  }
}

async function build() {
  if (isRunning) {
    buildIsPending = true;
    return false;
  }
  console.log(`Building to ${outputDir} ....`);
  isRunning = true;

  try {
    // Convert the typescript to JS
    const promises = pageCode
      .filter((fileInfo) => {
        // Only compile files that have changed since the last time
        const srcFilePath = `${rootDir}/browser/${fileInfo.name}.${fileInfo.ext}`;
        const destFilePath = `${rootDir}/${outputDir}/${fileInfo.name}.js`;
        const srcStat = fs.statSync(srcFilePath);
        const destStat = fs.existsSync(destFilePath)
          ? fs.statSync(destFilePath)
          : null;

        const hasChanged = destStat ? destStat.mtime < srcStat.mtime : true;

        return hasChanged;
      })
      .map((fileInfo) => {
        return new Promise((resolve, reject) => {
          exec(
            `${rootDir}/node_modules/.bin/tsc ${rootDir}/browser/${fileInfo.name}.${fileInfo.ext} --jsx react-jsx --outDir tmp`,
            function (err, stdout, stderr) {
              if (err) {
                console.error("Typescript error", stdout.toString());
                reject(err);
              }
              resolve(true);
            }
          );
        });
      });

    await Promise.all(promises);
  } catch (err) {
    buildIsPending = isRunning = false;
    return;
  }

  let currentCmd = null;
  try {
    pageCode.forEach((fileInfo) => {
      // Put all the JS files into a single JS file
      const possiblePaths = [
        `${rootDir}/tmp/browser/${fileInfo.name}.js`,
        `${rootDir}/tmp/${fileInfo.name}.js`,
      ];
      let foundPath = null;
      let justCopy = false;
      for (let i = 0; i < possiblePaths.length; i++) {
        if (fs.existsSync(possiblePaths[i])) {
          foundPath = possiblePaths[i];
          justCopy = true;
          break;
        }
      }

      if (justCopy) {
        if (shouldMinify) {
          const minifyCmd = `uglifyjs ${foundPath} --compress --mangle  -o ${foundPath}`;
          execSync(minifyCmd);
        }

        // Remove any @ts-ignore comments
        const fileContents = fs.readFileSync(foundPath).toString();
        const fileLines = fileContents.split("\n").filter((line) => {
          return line.indexOf("// @ts-") !== 0;
        });
        const newFileContents = fileLines.join("\n");
        fs.writeFileSync(foundPath, newFileContents);

        currentCmd = `cp ${foundPath} ${rootDir}/${outputDir}/`;
      } else {
        var cmd = `${rootDir}/node_modules/.bin/browserify ${foundPath} `;
        if (shouldMinify) {
          cmd += `-p [ tinyify --no-flat ] `;
        }

        currentCmd = `${cmd} > ${rootDir}/${outputDir}/${fileInfo.name}.js`;
      }
      execSync(currentCmd);
    });

    console.log("Build complete");

    isRunning = false;
    if (buildIsPending) {
      buildIsPending = false;
      build();
    }
  } catch (err) {
    console.error(
      "Browserify error running command",
      currentCmd,
      err.stdout ? err.stdout.toString() : err
    );
  }
}

if (ensureDir()) {
  build();

  if (shouldWatch) {
    watch(rootDir, { recursive: true }, function (evt, name) {
      if (excludedDirs.some((dir) => name.indexOf(dir) === 0)) {
        return;
      }
      build();
    });
  }
}
