import svgSpite from 'gulp-svg-sprite';

export const svgSprive = () => {
    return app.gulp.src(`${app.path.src.svgicons}`, {})
         // Вывод ошибок
         .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title : "SVG",
                message : "Error: <%= error.message %>"
            })
        ))
        .pipe(svgSpite({
            mode : {
                stack : {
                    sprite: '../icons/icons.svg',
                    // Создать страницу с перечнем иконок
                    example : true
                }
            },
        }))
        .pipe(app.gulp.dest(`${app.path.build.images}`));
}