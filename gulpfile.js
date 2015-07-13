var gulp = require('gulp'),
    debug = require('gulp-debug'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    foreach = require('gulp-foreach'),
    path = require('path'),
    scsslint = require('gulp-scss-lint');

// Settings ---------------

var SETTINGS = {
  scss: {
    src: {
      base: ['./src/scss/**'],
      path: ['./src/scss/**/index.scss']
    },
    options: {
      mode: 'default'
    },
    dist: {
      css: {
        path: './dist/css/' 
      },
      scss: {
        path: './dist/scss' 
      }
    },
    watch: {
      path: ['./src/scss/**/*.scss']
    }
  },
  img: {
    src: {
      path: ['./src/img/**']
    },
    dist: {
      path: ['./dist/css/img', './dist/scss/img']
    },
    watch: {
      path: ['./src/img/**']
    }
  },
  lib: {
    src: {
      path: ['./src/lib/**']
    },
    dist: {
      path: ['./dist/css/lib', './dist/scss/lib']
    },
    watch: {
      path: ['./src/lib/**']
    }
  }
};


// Tasks ---------------

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['scss', 'img', 'lib']);

gulp.task('watch', function() {
  gulp.watch(SETTINGS.scss.watch.path, ['scss']);
  gulp.watch(SETTINGS.img.watch.path, ['img']);
  gulp.watch(SETTINGS.lib.watch.path, ['lib']);
});


// Cleaning ---------------

gulp.task('clean:css', function() {
  return gulp.src(SETTINGS.scss.dist.css.path, {read: false}).pipe(clean({force: true})); 
});

gulp.task('clean:scss', function() {
  return gulp.src(SETTINGS.scss.dist.scss.path, {read: false}).pipe(clean({force: true}));
});

gulp.task('clean:img', function() {
  return gulp.src(SETTINGS.img.dist.path, {read: false}).pipe(clean({force: true}));
});

gulp.task('clean:lib', function() {
  return gulp.src(SETTINGS.lib.dist.path, {read: false}).pipe(clean({force: true}));
});


// Sass ---------------

gulp.task('scss', ['scss:lint', 'scss:scss', 'scss:css']);

gulp.task('scss:lint', function(done) {
  
  gulp
    .src(SETTINGS.scss.src.path)
    .pipe(scsslint())
    .on('end', done);
    
});

gulp.task('scss:scss', ['clean:scss'], function() {
  
  return gulp
    .src(SETTINGS.scss.src.base)
    .pipe(gulp.dest(SETTINGS.scss.dist.scss.path));
  
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
        .pipe(sass({
          outputStyle: 'nested'  
        }))
        .pipe(rename({
          dirname: '',
          basename: fileName,
          extname: '.css'
        }))
        .pipe(gulp.dest(SETTINGS.scss.dist.css.path));
    }));
    
});


// Images ---------------

gulp.task('img', ['clean:img'], function(done) {
  
  for(var k in SETTINGS.img.dist.path)
    gulp
      .src(SETTINGS.img.src.path)
      .pipe(imagemin({
        // No options
        // See https://www.npmjs.com/package/gulp-imagemin
      }))
      .pipe(gulp.dest(SETTINGS.img.dist.path[k]));
      
  done();
});

// Lib ---------------

gulp.task('lib', ['clean:lib'], function(done) {
  
  for(var k in SETTINGS.lib.dist.path)
    gulp
      .src(SETTINGS.lib.src.path)
      .pipe(gulp.dest(SETTINGS.lib.dist.path[k]));
  
  done();
});