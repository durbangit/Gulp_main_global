const { series, parallel} = require("gulp");

// Tasks dev
const {
   clean_dev, 
   html_dev, 
   scss_dev, 
   fonts_dev, 
   images_dev, 
   js_dev, 
   server_dev, 
   watcher_dev
} = require("./gulp/dev.js");

exports.clean_dev = clean_dev;
exports.html_dev = html_dev;
exports.scss_dev = scss_dev;
exports.fonts_dev = fonts_dev;
exports.images_dev = images_dev;
exports.js_dev = js_dev;
exports.server_dev = server_dev;
exports.watcher_dev = watcher_dev;

exports.default = series(
   clean_dev,
   parallel(html_dev, scss_dev, fonts_dev, images_dev, js_dev),
   parallel(server_dev, watcher_dev)
);

// Tasks docs
const {
   clean_docs, 
   html_docs, 
   scss_docs, 
   fonts_docs, 
   images_docs, 
   js_docs, 
   server_docs, 
   watcher_docs
} = require("./gulp/docs.js");

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

// format_fonts
const {
   clean_font,
   fonter_convert
} = require("./gulp/format_fonts.js");

exports.font = series(
   clean_font,
   fonter_convert
);