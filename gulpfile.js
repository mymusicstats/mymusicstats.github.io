// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var protractor = require("gulp-protractor").protractor;

// Lint Task
gulp.task('lint', function() {
    return gulp.src(['scrobble.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Minify JS
gulp.task('minify', function() {
    return gulp.src(['scrobble.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('*.js', ['lint', 'minify']);
});

// Protractor Task
gulp.task('protractor', function (done) {
        gulp.src(__dirname + './tests/')
        .pipe(protractor({
            configFile: './tests/conf.js',
        }))
        .on('error', function (e) { throw e })
    });

// Default Task
gulp.task('default', ['lint', 'minify', 'watch']);
