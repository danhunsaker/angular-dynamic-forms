var gulp = require('gulp');
var ngmin = require('gulp-ngmin');
var concat = require('gulp-concat');
var wrap = require("gulp-wrap");
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var pkg = require('./package.json');
var libFiles = './lib/**/*.js';
var releaseLocation = './release';

gulp.task('default', ['compress', 'watch']);

gulp.task('watch', function () {
  gulp.watch(libFiles, ['compress']);
});

gulp.task('compress', ['build'], function() {
  return gulp.src(releaseLocation + pkg.name + '.js')
    .pipe(uglify())
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(gulp.dest(releaseLocation))
});

gulp.task('build', function() {
  var wrapTemplate = '(function(angular, undefined){\n<%= contents %>\n}(angular, undefined));';

	return gulp.src(libFiles)
    .pipe(ngmin())
	  .pipe(concat(pkg.name + '.js'))
    .pipe(wrap(wrapTemplate))
    .pipe(gulp.dest(releaseLocation));
});



