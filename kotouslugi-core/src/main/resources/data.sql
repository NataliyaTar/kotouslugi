-- banners
INSERT INTO banner (id, bg, title, text, imgurl)
values (0,
        'linear-gradient(86deg, #FFFEDD 0%, #DDF7FF 100%)',
        'Открыта вакансия',
        'Ищем в команду лучшего кота для разработки котоуслуг',
        'work.png');
INSERT INTO banner (id, bg, title, text, imgurl)
values (1,
        'linear-gradient(86deg, #EDF2FE 0%, #F0FFF2 100%)',
        'Случилось несчастье',
        'Новая услуга на портале «Регистрация усопшего» поможет легко и быстро разобраться с документами',
        'ghost.png');
INSERT INTO banner (id, bg, title, text, imgurl)
values (2,
        'linear-gradient(86deg, #EDF2FE 0%, #D7E7FF 100%)',
        'Хотите завести котёнка?',
        'Услуга «Укотоение» поможет подобрать кото-приют и котёнка',
        'hugs.png');

/* Баннер для К-ЕГЭ */
INSERT INTO banner (id, bg, title, text, imgurl)
values (3,
        'linear-gradient(86deg, #EDF2FE 0%, #FFDDE8 100%)',
        'Узнайте результаты К-ЕГЭ!',
        'Новая услуга «Результаты К-ЕГЭ» отобразит текущие баллы по экзаменам и поможет с выбором подходящего Кото-Вуза',
        'read.png');

/*-- cat
INSERT INTO cat (id, name, age, sex, breed)
values (0,
        'Феликс',
        '1',
        'male',
        'british_shorthair'); */
INSERT INTO cat (id, name, age, sex, breed)
values (1,
        'Муся',
        '1',
        'female',
        'maine_coon');

-- service
INSERT INTO service(id, mnemonic, icon, title, description)
values (0,
        'new_family',
        'cupid.png',
        'Регистрация брака',
        'Вступайте в брак легко и быстро с котоуслугами');
INSERT INTO service(id, mnemonic, icon, title, description)
values (1,
        'vet',
        'sick.webp',
        'Запись на прием к ветеринару',
        'Подходи ответственно к своему здоровью. Здоровый ты - здоровая страна');
INSERT INTO service(id, mnemonic, icon, title, description)
values (2,
        'spa',
        'relax.png',
        'SPA-процедуры',
        'Устали от бесконечной работы и гонки за мышами? Пора записаться на расслабляющие процедуры');

/* Котоуслуга "К-ЕГЭ" */
INSERT INTO service(id, mnemonic, icon, title, description)
values (3,
        'exams', /* ИЗМЕНИТЬ НА exams ВМЕСТО education!!!*/
        'student.png',
        'Результаты К-ЕГЭ',
        'Узнай баллы по К-ЕГЭ и выбери подходящий для поступления Кото-ВУЗ вместе с котоуслугами!');

-- category
INSERT INTO category
values (0, 'Семья и дети');
INSERT INTO category
values (1, 'Медицина');
INSERT INTO category
values (2, 'Отдых и развлечение');
/* Категория для К-ЕГЭ */
INSERT INTO category
values (3, 'Образование');

-- service_to_category
INSERT INTO service_category
values (0, 0);
INSERT INTO service_category
values (1, 1);
INSERT INTO service_category
values (2, 2);
/* Для К-ЕГЭ */
INSERT INTO service_category
values (3, 3);


