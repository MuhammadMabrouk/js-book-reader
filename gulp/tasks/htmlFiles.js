const { src, dest } = require("gulp");
const fileInclude = require("gulp-file-include");
const rename = require("gulp-rename");
const beautify = require("gulp-jsbeautifier");
const connect = require("gulp-connect");

// html files
const srcPath = "src/*.html";
const destPath = "dist";
const watchPath = [
  srcPath,
  "src/schema/*.html",
  "src/components/**/*.html",
];

const htmlFiles = {
  htmlFiles: () => {
    return src(srcPath)
      .pipe(fileInclude({ basepath: "src" }))
      .pipe(rename({ dirname: "" }))
      .pipe(beautify({ indent_size: 2 }))
      .pipe(dest(destPath))
      .pipe(connect.reload());
  },
  watchPath,
};

module.exports = {
  htmlFiles,
};
