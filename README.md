# Создать свою ветку для работы команды
1. Выкачав репозиторий из gitHub мы попадаем на ветку master. Это "стартовая" ветка с подготовленным проектом
2. Отводим свою ветку от master с названием по правилу `2024-summer-team-XXX`, к примеру `2024-summer-team-krutie-bobri`

# Как запустить фронт
Перед тем, как приступить к работе, необходимо установить на компьютер:

node.js версии v18.19.1 и angular-cli - 17.3.1

1. В консоли перейти в папку [frontend](./frontend)
2. Выполнить команду `npm i` - подтянутся модули
3. Выполнить команду из [package](./frontend/package.json) `build` - соберется проект
4. Выполнить команду из [package](./frontend/package.json) `start` - запустится проект

Для первого запуска необходимо выполнить все пункты.
Для последующих только пункт 4

Работа происходит в директории [src](./frontend/src) в папках `app` и `assets`

Файлы помеченные в начале комментарием "Файл не трогаем" должны работать у каждой команды одинаково и дорабатывать их не нужно.
Удалять существующие файлы в папке `assets` нельзя! Добавлять свои - можно

# Как запустить бэк
Перед тем, как приступить к работе, необходимо установить на компьютер:
Intelliji IDEA, openJDK 17 или выше.

1. Открываем проект как Maven project.
2. Качаем зависимости (Справа экрана вкладка Maven, вверху кнопка со стрелочкой вниз `Download sources and documentation`)
3. Обновляем зависимости кнопкой (Reload All Maven Projects)
4. Убеждаемся, что никаких ошибок не подсвечивается в папке проекта по дереву.
5. Нажимаем кнопку `Run 'ApiApplication'`.
6. Если все сделать правильно, увидите в логах сообщение вида `Started ApiApplication in N seconds`

## Swagger
http://localhost:8080/swagger-ui/index.html#/

# Полезные ссылки по фронту

## Angular
https://angdev.ru/

## TypeScript
https://scriptdev.ru/book/why-typescript/

## Реактивное программирование
RxJS: https://rxjs.dev/guide/overview и https://angdev.ru/rxjs/about/

Angular reactive forms: https://angdev.ru/archive/angular9/angular-reactive-forms/

## Стили
Sass (scss): https://sass-lang.com/documentation/syntax/#scss и https://sass-scss.ru/guide/

## A11y
https://developer.mozilla.org/ru/docs/Web/Accessibility и 
https://habr.com/ru/articles/762186/

## Иконки
https://fonts.google.com/icons?selected=Material+Icons+Outlined:drive_file_rename_outline:&icon.category=file&icon.size=24&icon.color=%234D83FA&icon.set=Material+Icons&icon.platform=web

## Кот Пушин
https://www.google.com/search?q=pusheen+cat+transparent&newwindow=1&sca_esv=3697c3e79dce3da7&hl=ru&udm=2&biw=1920&bih=959&sxsrf=ADLYWIJmCD69k7UtygUFPOPjAfBbNJvZRQ%3A1718395931489&ei=G6RsZqnNHdLHwPAP1oWEMA&oq=pusheen+cat+tra&gs_lp=Egxnd3Mtd2l6LXNlcnAiD3B1c2hlZW4gY2F0IHRyYSoCCAEyBBAAGB4yBBAAGB4yBhAAGAgYHjIGEAAYCBgeMgYQABgIGB4yBhAAGAgYHjIGEAAYCBgeMgYQABgIGB4yBhAAGAgYHjIEEAAYHkjTFVCGAlieB3ABeACQAQCYAUagAYcCqgEBNLgBA8gBAPgBAZgCBaACkQLCAgQQIxgnwgIKEAAYgAQYQxiKBcICBRAAGIAEwgIHEAAYgAQYE8ICCBAAGBMYCBgemAMAiAYBkgcBNaAH0ho&sclient=gws-wiz-serp

## Удалить фон у картинок
https://removal.ai
