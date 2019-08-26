const gulp = require("gulp");
const clean = require("gulp-clean");
const imagemin = require("gulp-imagemin");
const jsonMinify = require("gulp-json-minify");
const minifyHTML = require("gulp-minify-html");
const minifyCSS = require("gulp-clean-css");
const express = require("express");
const path = require("path");
const sourcemaps = require("gulp-sourcemaps");
const preprocess = require("gulp-preprocess");
const terser = require("gulp-terser");
const ts = require("gulp-typescript");
const project = ts.createProject("./tsconfig.json");

function handleError(err) {
  console.log(err);
  console.log(err.toString());
  this.emit("end");
}

const devBuild =
  (process.env.NODE_ENV || "development").trim().toLowerCase() ===
  "development";

let settings;
if (devBuild) {
  settings = {
    DEBUG: true,
    dest: "./build/debug",
    res: "./build/debug"
  };
} else {
  settings = {
    dest: "./build/release",
    res: "./dist/inlined"
  };
}

function buildHtml() {
  return gulp
    .src("./src/html/index.html")
    .pipe(minifyHTML())
    .pipe(gulp.dest(settings.dest));
}

function buildCss() {
  return gulp
    .src("./src/css/style.css")
    .pipe(minifyCSS())
    .pipe(gulp.dest(settings.dest));
}

function cleanPng() {
  return gulp
    .src([`${settings.res}/*.png`, `${settings.dest}/*.png`], {
      read: false
    })
    .pipe(clean());
}
function buildPng() {
  return gulp
    .src("src/res/*.png")
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest(settings.dest))
    .pipe(gulp.dest(settings.res));
}

function cleanJson() {
  return gulp
    .src([`${settings.res}/*.json`, `${settings.dest}/*.json`], {
      read: false
    })
    .pipe(clean());
}

function buildJson() {
  return gulp
    .src("src/res/*.json")
    .pipe(jsonMinify())
    .pipe(gulp.dest(settings.dest))
    .pipe(gulp.dest(settings.res));
}

function compile() {
  let stream = project.src();

  if (devBuild) {
    stream = stream.pipe(sourcemaps.init());
  }

  stream = stream.pipe(project()).on("error", handleError);

  stream = stream.js.pipe(preprocess({ context: settings })).pipe(
    terser({
      toplevel: true
    })
  );

  if (devBuild) {
    stream = stream.pipe(sourcemaps.write("/"));
  }

  return stream.pipe(gulp.dest(settings.dest));
}

function serve() {
  var htdocs = path.resolve(__dirname, settings.dest);
  var app = express();

  app.use(express.static(htdocs));
  app.listen(1234, function() {
    console.log("Server started on http://localhost:1234");
  });
}

function watch() {
  gulp.watch(["./src/html/*.html"], buildHtml);
  gulp.watch(["./src/css/*.css"], buildCss);
  gulp.watch(["./src/ts/**/*.ts"], compile);
}

exports.serve = gulp.series(
  gulp.parallel(
    gulp.series(cleanPng, buildPng),
    gulp.series(cleanJson, buildJson),
    buildHtml,
    buildCss,
    compile
  ),
  gulp.parallel(watch, serve)
);

exports.build = gulp.parallel(
  gulp.series(cleanPng, buildPng),
  gulp.series(cleanJson, buildJson),
  buildHtml,
  buildCss,
  compile
);
