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
var runSequence = require('run-sequence');

var distRemote = "../dist/remote/"

gulp.task("clean", function () {
  return del.sync([
    ".tmp",
    "../dist/**"
  ], 
  {
    force: true
  });
});


gulp.task("copy-font-awesome", function () {
   return gulp.src([
        "node_modules/font-awesome/fonts/**", 
        ], { "base" : "./node_modules/font-awesome/" })
    .pipe(gulp.dest(distRemote));
});
gulp.task("copy", ["copy-font-awesome"], function () {
   gulp.src([
        "node_modules/font-awesome/fonts/**", 
        ], { "base" : "./node_modules/font-awesome/" })
    .pipe(gulp.dest(distRemote));
  return gulp.src([
        "src/partials/**", 
        "src/images/**", 
        "src/fonts/**",
        //"src/js/**",
        //"src/css/**"
        ], { "base" : "./src" })
    .pipe(gulp.dest(distRemote));
});

gulp.task("rev_index", function () {
  //process.chdir(path.join(__dirname, distRemote));
  process.chdir(path.join(__dirname, "src"));
  return gulp.src("./notes-speaker.html")    
    .pipe(usemin({
      css: [
        minifyCss(),
        rev()
      ],
      html: [
        minifyHtml({empty: true})
      ],
      js: [
        uglify(),
        rev()
      ]
    }))
    .pipe(gulp.dest("../../dist/remote"));
});

gulp.task('serve',  ['sass'], function(){
  browserSync.init({
    server:'./'
  });
  gulp.watch("src/sass/**/*.scss", ['sass']);
  gulp.watch("./**/*.html").on('change', reload);
  gulp.watch("./js/*.js").on('change', reload);
});

gulp.task('sass',function(){
  return gulp.src('src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', function logError(error) {
        console.error(error);
    })
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./src/css'))
    .pipe(reload({stream:true}));
});

gulp.task('sass-prod',function(){
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass()).on('error', function logError(error) {
        console.error(error);
    })
    .pipe(gulp.dest('./src/css'))
    .pipe(reload({stream:true}));
});

/* Default task */
gulp.task("default", ["sass"]);
gulp.task('build', function(){
  runSequence(
    'clean',
    'sass-prod',
    'copy', 
    'rev_index'
  );
});