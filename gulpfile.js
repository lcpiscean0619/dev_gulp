"use strict";

// Load plugins
const gulp = require("gulp");
const autoprefixer = require("autoprefixer");
const pug = require('gulp-pug');
const browsersync = require("browser-sync").create();
const cssnano = require("cssnano");
const del = require("del");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');

// html+nunjucks模版
const nunjucksRender = require('gulp-nunjucks-render');


// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "dist"
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean task
function clean() {
    return del(["dist", "/wwwroot/css", "/wwwroot/img"]);
}

// Images task
function images() {
    return gulp
        .src("src/img/**/*")
        .pipe(newer("dist/img"))
        .pipe(
            imagemin([
                imagemin.gifsicle({
                    interlaced: true
                }),
                imagemin.jpegtran({
                    progressive: true
                }),
                imagemin.optipng({
                    optimizationLevel: 5
                }),
                imagemin.svgo({
                    plugins: [{
                        removeViewBox: false,
                        collapseGroups: true
                    }]
                })
            ])
        )
        .pipe(gulp.dest("dist/img"));
}


// CSS task
function css() {
    var processors = [ // 定義 postCSS 所需要的元件
        autoprefixer({
            browserslistrc: ['last 5 version']
        }) // 使用 autoprefixer，這邊定義最新的五個版本瀏覽器
    ];
    return gulp.src("src/scss/*.scss")
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "expanded" //nested | expanded | compact | compressed
        }))
        .pipe(sourcemaps.write())
        .pipe(postcss(processors))
        .pipe(gulp.dest("dist/css"))
        .pipe(browsersync.stream())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("dist/css/"))
        .pipe(browsersync.stream());
}
// HTML task
function html() {
    return gulp.src('src/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browsersync.stream());
}

// nunjucksRender
function layout() {
    return gulp.src('src/*.html')
        .pipe(nunjucksRender({
            path: ['src/templates']
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browsersync.stream());
}

// js task
function scripts() {
    return (
        gulp
        .src(["src/js/**/*"])
        .pipe(plumber())
        // folder only, filename is specified in webpack config
        .pipe(gulp.dest("dist/js/"))
        .pipe(browsersync.stream())
    );
}
// 複製並同步
function copy() {
    return gulp.src(["dist/**", '!dist/*.html'])
        .pipe(gulp.dest("./wwwroot"));
}
// Watch files
function watchFiles() {
    gulp.watch("src/scss/**/*", gulp.series(css, copy));
    gulp.watch("src/js/**/*", gulp.series(scripts, copy));
    // gulp.watch("src/*/*.pug", gulp.series(layout, copy));
    gulp.watch("src/*.html", gulp.series(layout, copy));
    gulp.watch("src/img/**/*", gulp.series(images, copy));
}

// define complex tasks
const js = gulp.series(scripts);
const dev = gulp.series(clean, gulp.parallel(css, images, js, layout), copy);
const build = gulp.series(clean, gulp.parallel(css, images, js, layout));
const watch = gulp.parallel(build, watchFiles, browserSync);

// 一般開發輸出
//gulp.series(照順序執行)
//gulp.parallel(同時執行)

// export tasks
exports.images = images;
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.build = build;
exports.default = build;
exports.watch = watch;
// exports.html = html;
exports.layout = layout;
exports.copy = copy;
exports.dev = dev;
