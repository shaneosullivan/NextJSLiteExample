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
      var cmd = `${rootDir}/node_modules/.bin/browserify ${rootDir}/tmp/browser/${fileInfo.name}.js `;
      if (shouldMinify) {
        cmd += `-p [ tinyify --no-flat ] `;
      }

      currentCmd = `${cmd} > ${rootDir}/public/js/${fileInfo.name}.js`;
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
      err.stdout.toString()
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
