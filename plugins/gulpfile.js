"use strict";
// Include gulp
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps")
var path = require("path");
var browserSync = require("browser-sync").create();
var sass = require('gulp-sass');
var reload = browserSync.reload;

var uglify = require("gulp-uglify");
var minifyCss = require('gulp-minify-css');
var del = require("del");
var runSequence = require('run-sequence');

var distPlugins = "../dist/plugins/"

gulp.task("clean", function () {
  return del.sync([
    ".tmp",
    "../dist/**"
  ], 
  {
    force: true
  });
});


gulp.task("copy", function () {
   return gulp.src([
        "src/components/**", 
        "src/font/**", 
        ], { "base" : "./src" })
    .pipe(gulp.dest(distPlugins));
});

gulp.task("mincss", function () {
  return gulp.src("./src/css/*.css")    
    .pipe(minifyCss())
    .pipe(gulp.dest(distPlugins+"/css"));
});

gulp.task("uglify-plugins", function () {
  return gulp.src("./src/plugins/*.js")    
    .pipe(uglify())
    .pipe(gulp.dest(distPlugins+"/plugins"));
});

gulp.task("uglify", function () {
  return gulp.src("./src/js/*.js")    
    .pipe(uglify())
    .pipe(gulp.dest(distPlugins+"/js"));
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
    ['copy','uglify', 'uglify-plugins', 'mincss']
  );
});