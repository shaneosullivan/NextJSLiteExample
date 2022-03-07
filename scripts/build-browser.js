const { execSync } = require("child_process");
var watch = require("node-watch");

var rootDir = __dirname.replace("/scripts", "");

var excludedDirs = ["tmp", "public/js", "scripts"].map(
  (dir) => rootDir + "/" + dir
);

var shouldWatch = process.argv.some((arg) => arg === "--watch");
var shouldMinify = process.argv.some((arg) => arg === "--minify");

var isRunning = false;
var buildIsPending = false;

function build() {
  if (isRunning) {
    buildIsPending = true;
    return false;
  }
  isRunning = true;

  try {
    // First make sure that the directories we need exist
    execSync(`mkdir -p ${rootDir}/tmp && mkdir -p ${rootDir}/public/js`);
  } catch (err) {
    console.error("Mkdir error", err.stdout.toString());
    return;
  }

  try {
    // Convert the typescript to JS
    execSync(`npm run build-browser`);
  } catch (err) {
    console.error("Typescript error", err.stdout.toString());
    return;
  }

  try {
    // Put all the JS files into a single JS file
    var cmd = `browserify ${rootDir}/tmp/browser.js`;
    if (shouldMinify) {
      cmd += `-p [ tinyify --no-flat ] `;
    }
    execSync(`${cmd} > ${rootDir}/public/js/browser.js`);

    console.log("Build complete");

    isRunning = false;
    if (buildIsPending) {
      buildIsPending = false;
      build();
    }
  } catch (err) {
    console.error("Browserify error", err.stdout.toString());
  }
}

build();

if (shouldWatch) {
  watch(rootDir, { recursive: true }, function (evt, name) {
    if (excludedDirs.some((dir) => name.indexOf(dir) === 0)) {
      return;
    }
    build();
  });
}
