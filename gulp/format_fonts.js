
const { src, dest } = require("gulp");
// вывод ошибок
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
// удаление папки (convert_font)
const gulpClean = require("gulp-clean");
const fs = require("fs");
// для конвертации шрифтов
const fonter = require('gulp-fonter-unx');
var ttf2woff2 = require('gulp-ttf2woff2');


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

// функция удаление папки (dist)
function clean_font(done) {
   if (fs.existsSync("./convert_fonts_out")) {
      return src("./convert_fonts_out").pipe(gulpClean());
   }
   done();
}

function fonter_convert() {
   return src("./convert_fonts_in/*.*")
      .pipe(plumber(plumberNotify("FONTS")))
      .pipe(fonter({
         formats: ["ttf", "eot", "woff"]
      }))
      .pipe(ttf2woff2())
      .pipe(dest("./convert_fonts_out/"));
}

exports.clean_font = clean_font;
exports.fonter_convert = fonter_convert;