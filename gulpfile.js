var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    compass = require('gulp-compass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps');


gulp.task('default', ['watch']);


gulp.task('compass_compile', function(){
  gulp.src('src/assets/scss/**/*.scss')
    .pipe(plumber())
    .pipe(compass({
      config_file: 'src/config.rb',
      style: 'compressed',
      comments : false,
      css : 'public/assets/css',
      sass: 'src/assets/scss',
      sourcemap: false
    }))
    .pipe(gulp.dest('public/assets/css'));
});

gulp.task('watch', function(){
  livereload.listen();
  gulp.watch('src/assets/scss/**/*.scss', ['compass_compile']);
  gulp.watch('public/**/*.html').on('change', livereload.changed);
  gulp.watch('public/assets/css/**/*.css').on('change', livereload.changed);
  gulp.watch('public/assets/js/**/*.js').on('change', livereload.changed);
});
