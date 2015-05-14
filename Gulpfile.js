'use strict';

var gulp = require('gulp')
  , browserify = require('gulp-browserify')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename');

gulp.task('build', function () {
  return gulp.src('src/index.js')
    .pipe(browserify({
      standalone: 'ZenArea'
    }))
    .pipe(uglify({
      mangle: true,
      compress: true
    }))
    .pipe(rename('zenarea.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('default', ['build']);
