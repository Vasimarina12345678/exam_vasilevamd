"use strict";
// Plugins
const gulp = require('gulp'),// gulp plugin as gulp
    sass = require('gulp-sass'),// compile scss to css
    prefixer = require('gulp-autoprefixer'),// add or remove vendor prefixes
    htmlmin = require('gulp-htmlmin'),
    plumber = require('gulp-plumber'),// error handler
    rigger = require('gulp-rigger'),// utility to combine files
    terser = require('gulp-terser'),// compress js files
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),// webserver
    reload = browserSync.reload;

// Variable routes
const path ={
        build:{
            all:'build/',
            img:'build/img/',
            html:'build/',
            scss:'build/css/',
            js:'build/js/',
        },
        src:{
            img:'img/*.*',
            html:'*.{html,htm}',
            scss:'scss/style.scss',
            js:'js/main.js',
        },
        watch:{
            html:'*.{html,htm}',
            scss:'scss/**/*.scss',
            js:'js/*.js',
        },
        clean:'build/'
    },
    config = {
        server:{
            baseDir:'build/',
            index:'index.html',
        },
        host:'localhost',
        tunnel:true,
        port:7787
    };

gulp.task('clean',function (done) {
    rimraf(path.clean, done);
});

gulp.task('mv:img',function (done) {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream:true}));
    done();
});

gulp.task('dev:scss',function (done) {
    gulp.src(path.src.scss,{sourcemaps:true})
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'expanded',
            sourcemaps:true
        }))
        .pipe(prefixer({cascade: true}))
        .pipe(gulp.dest(path.build.scss,{sourcemaps:'.'}))
        .pipe(reload({stream:true}));
    done();
});

// gulp.task('prod:scss',function (done) {
//     gulp.src(path.src.scss)
//         .pipe(plumber())
//         .pipe(sass({
//             outputStyle: 'compressed'
//         }))
//         .pipe(prefixer({cascade: true}))
//         .pipe(gulp.dest(path.build.scss))
//         .pipe(reload({stream:true}));
//     done();
// });

gulp.task('dev:html',function (done) {
    gulp.src(path.src.html)
        .pipe(plumber())
        .pipe(htmlmin({
            // collapseWhitespace:true,
            html5:true
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream:true}));
    done();
});

gulp.task('dev:js',function (done) {
    gulp.src(path.src.js)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(terser())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream:true}));
    done();
});
gulp.task('webserver',function (done) {
    browserSync(config);
    done();
});

gulp.task('watch',function (done) {
    gulp.watch(path.watch.html,gulp.series('dev:html'));
    gulp.watch(path.watch.scss,gulp.series('dev:scss'));
    gulp.watch(path.watch.js,gulp.series('dev:js'));
    done();
});

// Tasks
gulp.task('default', gulp.series('clean', gulp.parallel('mv:img','dev:html','dev:scss','dev:js'),'watch','webserver'));
