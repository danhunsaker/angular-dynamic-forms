var gulp = require('gulp');
var ngmin = require('gulp-ngmin');
var concat = require('gulp-concat');
var wrap = require("gulp-wrap");
var cache = require('gulp-cached');
var rimraf = require('gulp-rimraf');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var pkg = require('./package.json');

gulp.task('default', ['compress', 'watch']);

gulp.task('watch', function () {
  gulp.watch('./lib/**/*.js', ['compress']);
});

gulp.task('compress', ['build'], function() {
  return gulp.src('./release/' + pkg.name + '.js')
    .pipe(uglify())
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(gulp.dest('./release'))
});

gulp.task('build', function() {
	return gulp.src('./lib/**/*.js')
    .pipe(ngmin())
	  .pipe(concat(pkg.name + '.js'))
    .pipe(wrap('(function(angular, undefined){\n<%= contents %>\n}(angular, undefined));'))
    .pipe(gulp.dest('./release'));
});



