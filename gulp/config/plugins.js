import replace from "gulp-replace";// Поиск и замена
import plumber from "gulp-plumber";// Обработка ошибок
import notify from "gulp-notify";// Сообщения (подсказки)
import browsersync from "browser-sync"; // Локальный сервер
import newer from "gulp-newer"// Проверка обнволения 
import ifPlugin from "gulp-if"// Условия ветвления


// Экспортируем объект
export const plugins = {
    replace: replace,
    plumber: plumber,
    notify: notify,
    browsersync: browsersync,
    newer : newer,
    if : ifPlugin,
}