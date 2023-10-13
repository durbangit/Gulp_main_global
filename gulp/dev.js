
const { src, dest, watch } = require("gulp");
const gulpServer = require("gulp-server-livereload");
// html
const incLude = require("gulp-file-include");
// scss
const sass = require("gulp-sass")(require("sass"));
const maps = require("gulp-sourcemaps");
const sassGlob = require("gulp-sass-glob");
// удаление папки (dist)
const gulpClean = require("gulp-clean");
const fs = require("fs");
// вывод ошибок
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
// img
const changed = require("gulp-changed");
// js

// функция удаление папки (dist)
function clean_dev(done) {
   if (fs.existsSync("./dist/")) {
      return src("./dist/").pipe(gulpClean());
   }
   done();
}

// вывод ошибок
const plumberNotify = (title) => {
   return {
      errorHandler: notify.onError({
         title: title,
         message: "Error <%= error.message %>",
         sound: false,
      }),
   };
};

// html
const fileIncludeSetting = {
   prefix: "@@",
   basepath: "@file",
};
function html_dev() {
   return src(["./app/html/**/*.html", "!./app/html/blocks/*.html"])
      .pipe(changed("./dist/", { hasChanged: changed.compareContents }))
      .pipe(plumber(plumberNotify("HTML")))
      .pipe(incLude(fileIncludeSetting))
      .pipe(dest("./dist/"));
}

// scss
function scss_dev() {
   return src("./app/scss/*.scss")
      .pipe(changed("./dist/css/"))
      .pipe(plumber(plumberNotify("SCSS")))
      .pipe(maps.init())
      .pipe(sassGlob())
      .pipe(sass())
      .pipe(maps.write())
      .pipe(dest("./dist/css/"));
}

// images
function images_dev() {
   return src("./app/img/**/*.*")
      .pipe(changed("./dist/img/"))
      .pipe(dest("./dist/img/"));
}

// icons
function fonts_dev() {
   return src("./app/fonts/**/*.*")
      .pipe(changed("./dist/fonts/"))
      .pipe(dest("./dist/fonts/"));
}

// js
function js_dev() {
   return src("./app/js/*.js")
      .pipe(changed("./dist/js/"))
      .pipe(plumber(plumberNotify("JS")))
      .pipe(dest("./dist/js/"));
}

// watch
function watcher_dev() {
   watch(["./app/html/**/*.html"], html_dev);
   watch("./app/scss/**/*.scss", scss_dev);
   watch("./app/fonts/**/*", fonts_dev);
   watch("./app/img/**/*", images_dev);
   watch("./app/js/**/*.js", js_dev);
}

// server
const serverOptions = {
   livereload: true,
   open: true,
};
function server_dev() {
   return src("./dist/").pipe(gulpServer(serverOptions));
}

exports.clean_dev = clean_dev;
exports.html_dev = html_dev;
exports.scss_dev = scss_dev;
exports.fonts_dev = fonts_dev;
exports.images_dev = images_dev;
exports.js_dev = js_dev;
exports.server_dev = server_dev;
exports.watcher_dev = watcher_dev;

