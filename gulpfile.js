'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

// Enable compressors
var isDevelopment = null;

try {
  isDevelopment = fs.statSync('development').isFile();
} catch(e) {
  isDevelopment = false;
}

var publicDirp = 'public';
var bowerDirp = 'bower_components';

var jsFiles = [
  // zepto
  path.join(bowerDirp, 'zepto/zepto.js'),

  // forge
  path.join(bowerDirp, 'forge/js/forge.bundle.js'),

  // site
  'app.js',
];

var siteJsFile = path.join(publicDirp, 'site.js');

// ==========
// JavaScript
// ==========

gulp.task('js', function() {
  return gulp.src(jsFiles)
  .pipe(isDevelopment ? gutil.noop() : sourcemaps.init())
  .pipe(concat(siteJsFile))
  .pipe(isDevelopment ? gutil.noop() : uglify())
  .pipe(isDevelopment ? gutil.noop() : sourcemaps.write('.'))
  .pipe(gulp.dest('.'));
});

gulp.task('js:watch', ['js'], function() {
  gulp.watch(jsFiles, ['js']);
})

gulp.task('watch', ['js:watch']);

gulp.task('default', ['js']);
