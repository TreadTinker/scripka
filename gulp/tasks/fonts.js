import fs from 'fs';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTtf = () => {
    //Ищем файлы шрифтов .otf
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title : "FONTS",
                message : "Error: <%= error.message %>"
            })
        ))
        //Конвертируем в .ttf
        .pipe(fonter ({
            formats: ['ttf']
        }))
        //Выгружаем в исходную папку
        .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}
export const ttfToWoff = () => {
    // Ищем файлы шрифтов .ttf
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title : "FONTS",
                message : "Error: <%= error.message %>"
            })
        ))
        // Convert to .woff
        .pipe(fonter ({
            formats: ['woff']
        }))
        // Upload to distFolder
        .pipe(app.gulp.dest(`${app.path.build.fonts}`))
        //ищем файлы шрифтов .ttf
        .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
        // Convert to .woof2
        .pipe(ttf2woff2())
        // Upload to distFolder
        .pipe(app.gulp.dest(`${app.path.build.fonts}`))
}
export const fontsStyle = () => {
    // Style file linked fonts
    let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
    // Проверяем существует ли файл шрифтов
    fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
        if (fontsFiles) {
            // Проверяем существует ли файл стилей для подключения шрифтов
            if(!fs.existsSync(fontsFile)) {
                // Если файла нет, то создаем его
                fs.writeFile(fontsFile, '', cb);
                let newFileOnly;
                for (var i = 0; i < fontsFiles.length; i++) {
                    // read linked font in style file
                    let fontsFileName = fontsFiles[i].split('.')[0];
                    if (newFileOnly !== fontsFileName) {
                        let fontName = fontsFileName.split('-')[0] ? fontsFileName.split('-')[0] : fontsFileName;
                        let fontsWeight = fontsFileName.split('-')[1] ? fontsFileName.split('-')[1] : fontsFileName;
                        if (fontsWeight.toLowerCase() === 'thin') {
                            fontsWeight = 100;
                        } else if (fontsWeight.toLowerCase() === 'extralight') {
                            fontsWeight = 200;
                        } else if (fontsWeight.toLowerCase() === 'light') {
                            fontsWeight = 300;
                        } else if (fontsWeight.toLowerCase() === 'medium') {
                            fontsWeight = 500;
                        } else if (fontsWeight.toLowerCase() === 'semibold') {
                            fontsWeight = 600;
                        } else if (fontsWeight.toLowerCase() === 'bold') {
                            fontsWeight = 700;
                        } else if (fontsWeight.toLowerCase() === 'extrabold' || fontsWeight.toLowerCase() === 'heavy') {
                            fontsWeight = 800;
                        } else if (fontsWeight.toLowerCase() === 'black') {
                            fontsWeight = 900;
                        } else {
                            fontsWeight = 400;
                        }
                        fs.appendFile(fontsFile,
                            `@font-face {
                                font-family: ${fontName};
                                font-display: swap;
                                src: url("../fonts/${fontsFileName}.woff2") format("woff2"), url("../fonts/${fontsFileName}.woff") format("woff");
                                font-weight: ${fontsWeight};
                                font-style: normal;
                            }\r\n`, cb);
                        //`@font-face {\n\tfont-family: ${fontName}}
                        newFileOnly = fontsFileName;
                    }
                }
            } else {
                // Если файл есть, выводим сообщение
                console.log("Файл scss/fonts.scss уже существуетю Для обновления необходимо его удалить");
            }
        }
    });
    return app.gulp.src(`${app.path.srcFolder}`);
    function cb(){ }
}