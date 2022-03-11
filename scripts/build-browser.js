const { execSync } = require("child_process");
const fs = require("fs");
var watch = require("node-watch");

var rootDir = __dirname.replace("/scripts", "");

var excludedDirs = ["tmp", "public", "scripts", "node_modules", "styles"].map(
  (dir) => rootDir + "/" + dir
);

var shouldWatch = process.argv.some((arg) => arg === "--watch");
var shouldMinify = process.argv.some((arg) => arg === "--minify");

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
    execSync(`mkdir -p ${rootDir}/tmp && mkdir -p ${rootDir}/public/js`);
    return true;
  } catch (err) {
    console.error("Mkdir error", err.stdout.toString());
    return false;
  }
}

function build() {
  if (isRunning) {
    buildIsPending = true;
    return false;
  }
  console.log("Building....");
  isRunning = true;

  try {
    // Convert the typescript to JS
    pageCode.forEach((fileInfo) => {
      execSync(
        `${rootDir}/node_modules/.bin/tsc ${rootDir}/browser/${fileInfo.name}.${fileInfo.ext} --jsx react-jsx --outDir tmp`
      );
    });
  } catch (err) {
    console.error("Typescript error", err.stdout.toString());
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
        // Remove any @ts-ignore comments
        const fileContents = fs.readFileSync(foundPath).toString();
        const fileLines = fileContents.split("\n").filter((line) => {
          return line.indexOf("// @ts-") !== 0;
        });
        const newFileContents = fileLines.join("\n");
        fs.writeFileSync(foundPath, newFileContents);

        currentCmd = `cp ${foundPath} ${rootDir}/public/js/`;
      } else {
        var cmd = `${rootDir}/node_modules/.bin/browserify ${foundPath} `;
        if (shouldMinify) {
          cmd += `-p [ tinyify --no-flat ] `;
        }

        currentCmd = `${cmd} > ${rootDir}/public/js/${fileInfo.name}.js`;
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
