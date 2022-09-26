import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css';// Сжатие CSS файла
import webpcss from 'gulp-webpcss';// Вывод Webp изображений
import autoprefixer from 'gulp-autoprefixer';// Добавление вердорных префиксов
import groupCssMediaQueries from 'gulp-group-css-media-queries';// Группировка медиа запросов

const sass = gulpSass(dartSass);

export const scss = () => {
    return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title : "SASS",
                message : "Error: <%= error.message %>"
            })
        ))
        .pipe(app.plugins.replace(/@img\//g, '../img/'))
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(
            app.plugins.if(
                app.isbuild,
                groupCssMediaQueries()
            )
        )    
        // Вывод Webp
        .pipe(
            app.plugins.if(
                app.isbuild,
                webpcss({
                webpClass: ".webp",
                noWebpClass: ".no-webp"
            }
                )
            )
        )   
        .pipe(
            app.plugins.if(
                app.isbuild,
                autoprefixer({
            grid: true,
            overrideBrowserslist: ["last 3 version"],
            cascade: true
                })
            )
        )    
        // Раскомментировать если нужен не сжатый файл стилей
        .pipe(app.gulp.dest(app.path.build.scss))
        .pipe(
            app.plugins.if(
                app.isbuild,
                cleanCss()
            )
        )
        .pipe(rename({
            extname : ".min.css"
        }))
        .pipe(app.gulp.dest(app.path.build.scss))
        .pipe(app.plugins.browsersync.stream());
}