"use strict";
// Include gulp
var gulp = require("gulp");
var path = require("path");
var del = require("del");
var runSequence = require('run-sequence');

var distPlugins = "../dist/server/"

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
        "src/server.js", 
        "src/package.json", 
        "src/README.md"
        ], { "base" : "./src" })
    .pipe(gulp.dest(distPlugins));
});

/* Default task */
gulp.task("default", ["build"]);
gulp.task('build', function(){
  runSequence(
    'clean',
    'copy'
  );
});