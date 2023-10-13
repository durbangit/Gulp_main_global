const { src, dest, watch, series, parallel } = require("gulp");
const gulpServer = require("gulp-server-livereload");
// html
const incLude = require("gulp-file-include");
htmlclean = require('gulp-htmlclean');
// scss
const sass = require("gulp-sass")(require("sass"));
const maps = require("gulp-sourcemaps");
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const groupMedia = require('gulp-group-css-media-queries');
var csso = require('gulp-csso');
// удаление папки (dist)
const gulpClean = require("gulp-clean");
const fs = require("fs");
// вывод ошибок
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
// img
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const webpHTML = require("gulp-webp-html");
const webpCss = require("gulp-webp-css");
const changed = require("gulp-changed");
// js

// функция удаление папки (dist)
function clean_docs(done) {
   if (fs.existsSync("./docs/")) {
      return src("./docs/").pipe(gulpClean());
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
function html_docs() {
   return src(["./app/html/**/*.html", "!./app/html/blocks/*.html"])
      .pipe(changed("./docs/", { hasChanged: changed.compareContents }))
      .pipe(plumber(plumberNotify("HTML")))
      .pipe(incLude(fileIncludeSetting))
      .pipe(webpHTML())
      .pipe(htmlclean())
      .pipe(dest("./docs/"));
}

// scss
function scss_docs() {
   return src("./app/scss/*.scss")
      .pipe(changed("./docs/css/"))
      .pipe(plumber(plumberNotify("SCSS")))
      .pipe(maps.init())
      .pipe(sassGlob())
      .pipe(sass())
      .pipe(webpCss())
      .pipe(groupMedia())
      .pipe(maps.write())
      .pipe(autoprefixer({ cascade: false }))
      .pipe(csso())
      .pipe(dest("./docs/css/"));
}

// images
function images_docs() {
   return src("./app/img/**/*.*")
      .pipe(changed("./docs/img/"))
      .pipe(webp())

      .pipe(src("./app/img/**/*.*"))
      .pipe(changed("./docs/img/"))
      .pipe(imagemin({ verbose: true }))

      .pipe(dest("./docs/img/"));
}

// icons
function fonts_docs() {
   return src("./app/fonts/**/*.*")
      .pipe(changed("./docs/fonts/"))
      .pipe(dest("./docs/fonts/"));
}

// js
function js_docs() {
   return src("./app/js/*.js")
      .pipe(changed("./docs/js/"))
      .pipe(plumber(plumberNotify("JS")))
      .pipe(dest("./docs/js/"));
}

// watch
function watcher_docs() {
   watch(["./app/html/**/*.html"], html_docs);
   watch("./app/scss/**/*.scss", scss_docs);
   watch("./app/fonts/**/*", fonts_docs);
   watch("./app/img/**/*", images_docs);
   watch("./app/js/**/*.js", js_docs);
}

// server
const serverOptions = {
   livereload: true,
   open: true,
};
function server_docs() {
   return src("./docs/").pipe(gulpServer(serverOptions));
}

exports.clean_docs = clean_docs;
exports.html_docs = html_docs;
exports.scss_docs = scss_docs;
exports.fonts_docs = fonts_docs;
exports.images_docs = images_docs;
exports.js_docs = js_docs;
exports.server_docs = server_docs;
exports.watcher_docs = watcher_docs;

exports.docs = series(
   clean_docs,
   parallel(html_docs, scss_docs, fonts_docs, images_docs, js_docs),
   parallel(server_docs, watcher_docs)
);