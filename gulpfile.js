var gulp = require('gulp');
//var clean = require('gulp-clean');
// var del = require('del');
var browser_sync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var cssmin = require('gulp-cssmin');
var jslint = require('gulp-jslint');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var template = require('gulp-template-compile');
var clean = require('gulp-rimraf');
var gulpSequence = require('gulp-sequence');



var bases = {
  app: 'app/',
  dist:'dist/'
};

var paths = {
  scripts: {
    start: ['app/**/*.ts','./@types/**/*.ts'],
    end: bases.dist + 'scripts'
  },
  styles: {
    start: ['app/styles/*.scss', 'app/bower_components/bootstrap-sass/assets/stylesheets/bootstrap/mixins/*.scss','app/bower_components/bootstrap-sass/assets/stylesheets/bootstap/*.scss','app/bower_components/boostrap/scss/*.scss'],
    end: bases.dist + 'styles'
  },
  bower: {
    start: ['app/bower_components/bootstrap-sass/assets/javascripts/*.js'],
    end: bases.dist + 'bower'
  },
  views: {
    start: ['app/views/*.html'],
    end: bases.dist + 'scripts'
  },
 images: {
    start: ['app/images/**/*.{jpg,png}'],
    end: bases.dist + 'images'
  },
  main: {
    start: ['app/index.html'],
    end: bases.dist
  }
};

gulp.task('clean',function(){
    'use strict';
    console.log("Clean all files in build folder");
   return gulp.src('dist/*', { read: false }).pipe(clean());
    // return gulp.src(bases.dist, {
    //     read: false
    // }).pipe(clean());
});

gulp.task('scripts',function(){
    'use strict';
     gulp.src(paths.scripts.start)
     .pipe(typescript({
            noImplicitAny: true,
            target: "ES6"
     }))
    .pipe(concat('script.js'))
    .pipe(jslint())
   // .pipe(jslint.reporter('default'))
    .pipe(gulp.dest(paths.scripts.end));
});

gulp.task('styles',function(){
    'use strict';
     gulp.src(paths.styles.start)
    .pipe(sass())
    .pipe(cssmin())
    .pipe(gulp.dest(paths.styles.end));
});
gulp.task('images',function(){
    'use strict';
     gulp.src(paths.images.start)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.end));
});

gulp.task('views',function(){
    'use strict';
     gulp.src(paths.views.start)
    .pipe(template()) // converts html to JS
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(paths.views.end));
});

gulp.task('main',function(){
    'use strict';
     gulp.src(paths.main.start)
    .pipe(gulp.dest(paths.main.end));
});
    
gulp.task('bower',function(){
    'use strict';
     gulp.src(paths.bower.start)
    .pipe(concat('vender.js'))
    .pipe(jslint())
    .pipe(gulp.dest(paths.bower.end));
});

gulp.task('LocalDeploy', gulpSequence('clean','main','styles','bower','views','scripts'));

gulp.task('reload',function(){
    browser_sync.reload();
});

gulp.task('server', ['brower-sync'],function(){
   gulp.watch(paths.scripts.start,['scripts','reload']);
   gulp.watch(paths.styles.start,['styles','reload']);
   gulp.watch(paths.images.start,['images','reload']);
   gulp.watch(paths.main.start,['main','reload']);
   gulp.watch(paths.bower.start,['bower','reload']);
   gulp.watch(paths.views.start,['views','reload']);
});

gulp.task('brower-sync',function(){
    browser_sync.init({
        open:true,
        port:9000,
        server:{
            baseDir:'dist'
        }
    });
});

