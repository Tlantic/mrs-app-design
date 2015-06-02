var gulp = require('gulp'),
    debug = require('gulp-debug'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    foreach = require('gulp-foreach'),
    path = require('path');

// Settings
var SETTINGS = {
  dist: {
    path: {
      css: './dist/css/',
      scss: './dist/scss'
    }
  },
  scss: {
    src: {
      base: ['./src/scss/**'],
      path: ['./src/scss/**/index.scss']
    },
    watch: {
      path: ['./src/scss/**/*.scss']
    },
    compress: false
  }
};

// Tasks

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['scss']);

gulp.task('watch', function() {
  
  gulp.watch(SETTINGS.scss.watch.path, ['scss']);
  
});

// Cleaning

gulp.task('clean:css', function() {
  return gulp.src(SETTINGS.dist.path.scss, {read: false}).pipe(clean({force: true})); 
});

gulp.task('clean:scss', function() {
  return gulp.src(SETTINGS.dist.path.scss, {read: false}).pipe(clean({force: true}));
});

// Sass

gulp.task('scss', ['scss:scss', 'scss:css']);

gulp.task('scss:scss', ['clean:scss'], function() {
  
  return gulp
    .src(SETTINGS.scss.src.base)
    .pipe(gulp.dest(SETTINGS.dist.path.scss));
  
});

gulp.task('scss:css', ['clean:css'], function() {
  
   return gulp
    .src(SETTINGS.scss.src.path)
    //.pipe(debug({minimal:false}))
    // Rename files
    .pipe(foreach(function(stream, file) {
      // It should be folder name or file name when in root
      var fileName = path.basename(file.relative.split(path.sep).slice(-2).shift(), '.scss');
      
      return stream
        .pipe(rename({
          dirname: '',
          basename: fileName,
          extname: '.css'
        }));
    }))
    // Sass files
    .pipe(sass.sync().on('error', sass.logError))
    // Output to dist folder
    .pipe(gulp.dest(SETTINGS.dist.path.css));
    
});