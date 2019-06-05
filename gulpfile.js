var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    rename      = require('gulp-rename'),
    cssmin      = require('gulp-cssnano'),
    prefix      = require('gulp-autoprefixer'),
    plumber     = require('gulp-plumber'),
    notify      = require('gulp-notify'),
    sassLint    = require('gulp-sass-lint'),
    sourcemaps  = require('gulp-sourcemaps'),
    ejs = require("gulp-ejs");

    // Temporary solution until gulp 4
    // https://github.com/gulpjs/gulp/issues/355
    runSequence = require('run-sequence');

var displayError = function(error) {
  // Initial building up of the error
  var errorString = '[' + error.plugin.error.bold + ']';
  errorString += ' ' + error.message.replace("\n",''); // Removes new line at the end

  // If the error contains the filename or line number add it to the string
  if(error.fileName)
      errorString += ' in ' + error.fileName;

  if(error.lineNumber)
      errorString += ' on line ' + error.lineNumber.bold;

  // This will output an error like the following:
  // [gulp-sass] error message in file_name on line 1
  console.error(errorString);
};

var onError = function(err) {
  notify.onError({
    title:    "Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>",
    sound:    "Basso"
  })(err);
  this.emit('end');
};

var sassOptions = {
  outputStyle: 'expanded'
};

var prefixerOptions = {
  browsers: ['last 2 versions']
};

// BUILD SUBTASKS
// ---------------

gulp.task('build', function() {
  return gulp.src('./src/scss/app.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(prefix(prefixerOptions))
    .pipe(rename('upsum.css'))
    .pipe(gulp.dest('docs/css'))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('docs/css'))
});

gulp.task('build', function() {
  return gulp.src('./src/scss/app.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(prefix(prefixerOptions))
    .pipe(rename('upsum.css'))
    .pipe(gulp.dest('docs/css'))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('docs/css'))
});

gulp.task('ejs', function(){
  gulp.src("./src/html/*.ejs")
  .pipe(ejs())
  .pipe(rename({ extname: '.html' }))
  .pipe(gulp.dest("./docs"))
});


gulp.task('sass-lint', function() {
  gulp.src(['./src/scss/**/*.scss', 'src/scss/*.scss'])
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('watch', function() {
  gulp.watch(['./src/html/*.ejs', './src/scss/**/*.scss', 'src/scss/*.scss'], ['build', 'ejs']);
});

// BUILD TASKS
// ------------

gulp.task('default', function(done) {
  runSequence('build', 'ejs', 'watch', done);
});

gulp.task('compile', function(done) {
  runSequence('build', 'ejs', done);
});