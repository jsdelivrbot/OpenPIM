'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

// Enable compressors
var isDevelopment = null;

try {
  isDevelopment = fs.statSync('development').isFile();
} catch(e) {
  isDevelopment = false;
}

var srcDirp = 'src';
var publicDirp = 'public';
var bowerDirp = 'bower_components';

// ==========
// JavaScript
// ==========

var jsVendorFiles = [
  path.join(bowerDirp, 'jquery/dist/jquery.js'),
  path.join(bowerDirp, 'what-input/dist/what-input.js'),
  path.join(bowerDirp, 'foundation-sites/dist/js/foundation.js'),
  path.join(bowerDirp, 'forge/js/forge.bundle.js')
];

var jsUserFiles = [
  path.join(srcDirp, 'js/app.js')
];

var jsOutputFile = path.join(publicDirp, 'site.js');

gulp.task('js', function() {
  return gulp.src(jsVendorFiles.concat(jsUserFiles))
  .pipe(isDevelopment ? gutil.noop() : sourcemaps.init())
  .pipe(concat(jsOutputFile))
  .pipe(isDevelopment ? gutil.noop() : uglify())
  .pipe(isDevelopment ? gutil.noop() : sourcemaps.write('.'))
  .pipe(gulp.dest('.'));
});

gulp.task('js:watch', ['js'], function() {
  gulp.watch(jsUserFiles, ['js']);
});

// ====
// SASS
// ====

var sassIncludePaths = [
  path.join(bowerDirp, 'foundation-sites/scss')
];

var sassUserFiles = [
  path.join(srcDirp, 'sass/app.scss')
];

var sassOutputFile = path.join(publicDirp, 'site.css');

gulp.task('sass', function() {
  return gulp.src(sassUserFiles)
  .pipe(isDevelopment ? gutil.noop() : sourcemaps.init())
  .pipe(sass({
    includePaths: sassIncludePaths,
    outputStyle: isDevelopment ? 'expanded' : 'compact'
  }).on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: isDevelopment
  }))
  .pipe(concat(sassOutputFile))
  .pipe(isDevelopment ? gutil.noop() : minifycss())
  .pipe(isDevelopment ? gutil.noop() : sourcemaps.write('.'))
  .pipe(gulp.dest('.'));
});

gulp.task('sass:watch', ['sass'], function() {
  gulp.watch(sassUserFiles, ['sass']);
});

// ======
// Global
// ======

gulp.task('watch', ['js:watch', 'sass:watch']);

gulp.task('default', ['js', 'sass']);
