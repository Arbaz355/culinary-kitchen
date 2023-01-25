const {src, dest, watch, series} = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const browsersync = require('browser-sync').create();

//sass task for style css
function scssTask(){
    return src('asset/scss/style.scss', {sourcemaps:true})
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(dest ('dist', {sourcemaps: '.'}));
}

//sass task minified style css
function scssTaskMinified(){
    return src('asset/scss/style.scss', {sourcemaps:true})
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(postcss([autoprefixer, cssnano()]))
    .pipe(rename('style.min.css'))
    .pipe(dest('dist', {sourcemaps: '.'}))
}

//browserSync launch server
function browsersyncServe(cb){ //cb is callback here
    browsersync.init({
        server: {
            baseDir: '.'
        }
    });
    cb();
}

// browser sync reload
function browsersyncReload(cb){ // cb is callback here 
    browsersync.reload();
    cb();
}

// watchtask
function watchTask(){
    watch('*.html', browsersyncReload);
    watch(['asset/scss/**/*.scss', 'asset/js/main.js'], series(scssTask, scssTaskMinified, browsersyncReload));
}

exports.default = series(
    scssTask,
    scssTaskMinified,
    browsersyncServe,
    watchTask
);