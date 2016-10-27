var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var cp = require('child_process');
var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

gulp.task('jekyll-build', function (done) {
    //browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

gulp.task('browserSync', ['jekyll-build', 'sass'], function() {
    browserSync.init({
        server: {
            baseDir: "_site"
        }
    });
});

gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: '_site'
    });
    gulp.watch('_sass/*/**/*.scss', ['sass']);
    gulp.watch('*.html').on('change', browserSync.reload);
});

gulp.task('sass', function() {
    return gulp.src('_sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(['last 2 versions', '> 2%', 'ie 8'], { cascade: true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.stream()); // auto-inject CSS
});

gulp.task('sass:minify', function() {
    return gulp.src('_sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer(['last 2 versions', '> 2%', 'ie 8'], { cascade: true}))
        .pipe(gulp.dest('_site/css'));
});

gulp.task('watch', function() {
    gulp.watch('_sass/**/*.scss', ['sass']);
    gulp.watch(['_layouts/*.html', '_includes/*.html', '_posts/*.md', '*.html', '*.md', 'module/**/*'], ['jekyll-rebuild']);
});

gulp.task('build_sync', ['browserSync', 'watch']);

gulp.task('default', ['build_sync', 'build']);

gulp.task('build', ['sass:minify']);
