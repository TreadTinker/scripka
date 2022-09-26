import fileinclude from "gulp-file-include";
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import versionNumber from "gulp-version-number";

export const html = () => {
    return app.gulp.src(app.path.src.html)
        // Вывод ошибок
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title : "HTML",
                message : "Error: <%= error.message %>"
            })
        ))
        // Подключение файлов
        .pipe(fileinclude())
        // Замена имени папки при сборке
        .pipe(app.plugins.replace(/@img\//g, 'img/'))
        // Конвертирование изображений в Webp
        .pipe(
            app.plugins.if(
                app.isbuild,
                webpHtmlNosvg()
                )
        )    
        // Вывод версии с датой и временем
        .pipe(
            app.plugins.if(
                app.isbuild,
                    versionNumber({
                        'value' : '%DT%',
                        'append' : {
                            'key' : '_v',
                            'cover' : 0,
                            'to' : [
                                'css',
                                'js',
                            ]
                        },
                        'output' : {
                            'file' : 'gulp/version.json'
                        }
                    })
            )
        )    
        .pipe(app.gulp.dest(app.path.build.html))
        .pipe(app.plugins.browsersync.stream());
};