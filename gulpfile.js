var gulp = require('gulp'),
    gulpSass = require('gulp-sass'),
    gulpPlumber = require('gulp-plumber'),
    gulpImagemin = require('gulp-imagemin');   

gulp.task('watch', function () {
    gulp.watch('public/css/*.scss', ['styles']);
});

gulp.task('styles', function () {
    gulp.src('public/css/*.scss')    // 指定要處理的 Scss 檔案目錄
        .pipe(gulpPlumber()) 
        .pipe(gulpSass({          
            outputStyle: 'compressed'
        }))         // 編譯 Scss
        .pipe(gulp.dest('public/css'));  // 指定編譯後的 css 檔案目錄
});


gulp.task('image', function () {
    gulp.src('public/img/**')
        .pipe(gulpImagemin())
        .pipe(gulp.dest('public/img'));
});