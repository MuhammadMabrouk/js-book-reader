// parallel() to run them at concurrency
const { parallel } = require("gulp");

// plugin for webserver & LiveReload
const connect = require("gulp-connect");

// tasks
const { htmlFiles }         = require("./gulp/tasks/htmlFiles");
const { cssMain }           = require("./gulp/tasks/cssMain");
const { cssLibraries }      = require("./gulp/tasks/cssLibraries");
const { jsBundle }          = require("./gulp/tasks/jsBundle");
const { assetsFiles }       = require("./gulp/tasks/assetsFiles");
const { assetsImages }      = require("./gulp/tasks/assetsImages");
const { assetsFontAwesome } = require("./gulp/tasks/assetsFontAwesome");
const { cleanup }           = require("./gulp/tasks/cleanup");
const { zipper }            = require("./gulp/tasks/zipper");
const { build }             = require("./gulp/tasks/build");

// utils functions
const { watchTasks } = require("./gulp/utils/watchTasks");

// watcher task
const watcher = (cb) => {
  connect.server({
    root: "./dist/",
    livereload: true,
    port: 8888,
  });

  // html task
  watchTasks(htmlFiles);

  // main css task
  watchTasks(cssMain);

  // css libraries task
  watchTasks(cssLibraries);

  // js bundle task
  watchTasks(jsBundle);

  // assets files task
  watchTasks(assetsFiles);

  // assets images task
  watchTasks(assetsImages);

  // assets font-awesome task
  watchTasks(assetsFontAwesome);

  cb();
};

// export public tasks to be run by the gulp command
module.exports = {
  htmlFiles: htmlFiles.htmlFiles,
  cssMain: cssMain.cssMain,
  cssLibraries: cssLibraries.cssLibraries,
  jsBundle: jsBundle.jsBundle,
  assetsImages: assetsImages.assetsImages,
  assetsFiles: assetsFiles.assetsFiles,
  assetsFontAwesome: assetsFontAwesome.assetsFontAwesome,
  cleanup,
  zipper,
  build,

  // default task
  default: parallel(watcher),
};
