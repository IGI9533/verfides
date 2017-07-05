var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    imageminJpegtran = require('imagemin-jpegtran'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemap = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    watch = require('gulp-watch'),
    del = require('del'),
    csscomb = require('gulp-csscomb');

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});
gulp.task('styles', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sourcemap.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 4 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(sourcemap.write('./'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream());
});
gulp.task('image_min', function() {
    return gulp.src('src/images/**')
        .pipe(imagemin({
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant(), imageminJpegtran({
                optimizationLevel: 7,
                interlaced: true,
                progressive: true
            })]
        }))
        .pipe(gulp.dest('images'));
});
gulp.task('watch', function() {
    gulp.watch('src/**/**', ['styles']);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("js/*.js").on('change', browserSync.reload);
});
//development task
gulp.task('default', ['browser-sync', 'styles', 'image_min', 'watch']);



/**********/
gulp.task('clean', function() {
    del(['css/*.map'], function (err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});
gulp.task('csscomb', function() {
    return gulp.src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 4 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(csscomb())
    .pipe(gulp.dest('css'));
});

//distributive task
gulp.task('dist', ['clean', 'csscomb']);

