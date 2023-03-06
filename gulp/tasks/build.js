const { parallel, series } = require("gulp");

// tasks
const { htmlFiles }             = require("./htmlFiles");
const { cssMain }               = require("./cssMain");
const { cssLibraries }          = require("./cssLibraries");
const { jsMain }                = require("./jsMain");
const { assetsFiles }           = require("./assetsFiles");
const { assetsImages }          = require("./assetsImages");
const { assetsFontAwesome }     = require("./assetsFontAwesome");
const { cleanup }               = require("./cleanup");
const { zipper }                = require("./zipper");

// common tasks
const commonTasks = parallel(
  htmlFiles.htmlFiles,
  cssMain.cssMain,
  cssLibraries.cssLibraries,
  jsMain.jsMain,
  assetsFiles.assetsFiles,
  assetsImages.assetsImages,
  assetsFontAwesome.assetsFontAwesome,
);

// build all files to dist folder
const build = series(
  cleanup,
  commonTasks,
  zipper
);

module.exports = {
  build,
};
