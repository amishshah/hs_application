var gulp = require('gulp');
var terser = require('gulp-terser');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var replace = require('gulp-replace');
var parallel = gulp.parallel;

const paths = {
  css: {
    src: ['src/public/css/**/*.css', '!src/public/css/**/*.min.css'],
    dest: 'dist/public/css/'
  },
  css_min: {
    src: ['src/public/css/**/*.min.css'],
    dest: 'dist/public/css/'
  },
  scripts: {
    src: ['src/public/js/**/*.js', '!src/public/js/**/*.min.js'],
    dest: 'dist/public/js/'
  },
  scripts_min: {
    src: 'src/public/js/**/*.min.js',
    dest: 'dist/public/js/'
  },
  views: {
    src: 'src/views/**/*.ejs',
    dest: 'dist/views/'
  },
  images: {
    src: ['src/public/img/**/*.jpg', 'src/public/img/**/*.png'],
    dest: 'dist/public/img/'
  },
  publicRoot: {
    src: 'src/public/*',
    dest: 'dist/public/'
  },
  hackathonSettings: {
    src: ['src/settings/**/*', '!src/settings/**/*.ts'],
    dest: 'dist/settings/'
  },
  autocompleteJSON: {
    src: 'src/public/js/**/*.json',
    dest: 'dist/public/js'
  }
};

function css() {
  return gulp.src(paths.css.src)
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.css.dest));
}

function cssCopyMin() {
  return gulp.src(paths.css_min.src)
    .pipe(gulp.dest(paths.css_min.dest));
}

function scripts() {
  return gulp.src(paths.scripts.src, {
      sourcemaps: true
    })
    .pipe(terser())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.scripts.dest))
}

function scriptsCopyMin() {
  return gulp.src(paths.scripts_min.src)
    .pipe(gulp.dest(paths.scripts_min.dest));
}

function views() {
  return gulp.src(paths.views.src)
    /* The regex looks complicated but here are the steps:
     * 1. Positive lookbehind -- check that the HTML contains src=" or ', href=" or '
     * (this prevents changing references to remote resources)
     * 2. Check for any charater any number of times, this is the uri
     * 3. Positive lookahead for the file extension being .js or .css with no other characters after
     * Replaces the match with .min.js or .min.css
     */
    .pipe(replace(/(?<=(src|href)=['"])[\/a-zA-z-_]+(?=\.(js|css)[^a-z])/gm, '$&.min'))
    .pipe(gulp.dest(paths.views.dest));
}

function images() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

function copyRemainingPublic() {
  return gulp.src(paths.publicRoot.src)
    .pipe(gulp.dest(paths.publicRoot.dest));
}

function copyHackathonSettings() {
  return gulp.src(paths.hackathonSettings.src)
    .pipe(gulp.dest(paths.hackathonSettings.dest));
}

function copyAutocompleteJSON() {
  return gulp.src(paths.autocompleteJSON.src)
    .pipe(gulp.dest(paths.autocompleteJSON.dest));
}

exports.default = parallel(
  images,
  views,
  scripts,
  scriptsCopyMin,
  css,
  cssCopyMin,
  copyRemainingPublic,
  copyHackathonSettings,
  copyAutocompleteJSON
);