var gulp = require("gulp");
var clean = require("gulp-clean");
var imagemin = require("gulp-imagemin");
var jsonMinify = require("gulp-json-minify");

gulp.task("clean-assets-png", function() {
  return gulp
    .src("build/*.png", {
      read: false
    })
    .pipe(clean());
});

gulp.task("clean-assets-json", function() {
  return gulp
    .src("build/*.json", {
      read: false
    })
    .pipe(clean());
});

gulp.task(
  "build-assets-png",
  gulp.series("clean-assets-png", function() {
    return gulp
      .src("src/res/*.png")
      .pipe(imagemin({ progressive: true }))
      .pipe(gulp.dest("build"));
  })
);

gulp.task(
  "build-assets-json",
  gulp.series("clean-assets-json", function() {
    return gulp
      .src("src/res/*.json")
      .pipe(jsonMinify())
      .pipe(gulp.dest("build"));
  })
);

gulp.task(
  "build-assets-dev",
  gulp.series(
    gulp.parallel("clean-assets-png", "clean-assets-json"),
    gulp.parallel("build-assets-png", "build-assets-json")
  )
);
gulp.task("default", () => {
  gulp.series("build-assets-dev", () => {
    gulp.watch("src/res/*.*", gulp.series("build-assets-dev"));
  })
});

gulp.task("prd-clean-assets-png", function() {
  return gulp
    .src("dist/inlined/*.png", {
      read: false
    })
    .pipe(clean());
});

gulp.task("prd-clean-assets-json", function() {
  return gulp
    .src("dist/inlined/*.json", {
      read: false
    })
    .pipe(clean());
});

gulp.task(
  "prd-build-assets-png",
  gulp.series("prd-clean-assets-png", function() {
    return gulp
      .src("src/res/*.png")
      .pipe(imagemin({ progressive: true }))
      .pipe(gulp.dest("dist/inlined"));
  })
);

gulp.task(
  "prd-build-assets-json",
  gulp.series("prd-clean-assets-json", function() {
    return gulp
      .src("src/res/*.json")
      .pipe(jsonMinify())
      .pipe(gulp.dest("dist/inlined"));
  })
);

gulp.task(
  "prd-build-assets",
  gulp.parallel("prd-build-assets-png", "prd-build-assets-json")
);
