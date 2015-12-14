"use strict";
// Include gulp
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps")
var path = require("path");
var browserSync = require("browser-sync").create();
var sass = require('gulp-sass');
var reload = browserSync.reload;

var rev = require("gulp-rev");
var uglify = require("gulp-uglify");
var usemin = require("gulp-usemin");
var minifyCss = require('gulp-minify-css');
var minifyHtml = require("gulp-minify-html");
var del = require("del");

var distRemote = "../dist/remote/"

gulp.task("clean", function () {
  return del.sync([
    ".tmp",
    "dist/**"
  ]);
});

gulp.task("copy", ["clean", "sass-prod"], function () {
  return gulp.src(["index.html",
        "src/partials/**", 
        "src/images/**", 
        "src/fonts/**"
        ], { "base" : "." })
    .pipe(gulp.dest(distRemote));
});

gulp.task("rev_index", function () {
  process.chdir(path.join(__dirname, distRemote));
  return gulp.src("./index.html")    
    .pipe(usemin({
      css: [
        minifyCss(),
        rev()
      ],
      html: [
        minifyHtml({empty: true})
      ],
      jsdefault: [
        uglify(),
        rev()
      ],
      jsscripts: [
        uglify(),
        rev()
      ]
    }))
    .pipe(gulp.dest("."));
});

gulp.task("cleanAfter", ["rev_index"], function () {
  return del.sync([
    /*"custo/custo.css", "custo/main.css", "custo/loader.css",
    "js/default.js",
    "js/scripts.js"
    */
  ]);
});

gulp.task('serve',  ['sass'], function(){
  browserSync.init({
    server:'./'
  });
  gulp.watch("sass/**/*.scss", ['sass']);
  gulp.watch("./**/*.html").on('change', reload);
  gulp.watch("./js/*.js").on('change', reload);
});

gulp.task('sass',function(){
  return gulp.src('sass/**/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', function logError(error) {
        console.error(error);
    })
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'))
    .pipe(reload({stream:true}));
});

gulp.task('sass-prod',function(){
  return gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', function logError(error) {
        console.error(error);
    })
    .pipe(gulp.dest('./css'))
    .pipe(reload({stream:true}));
});

/* Default task */
gulp.task("default", ["cleanAfter"]);