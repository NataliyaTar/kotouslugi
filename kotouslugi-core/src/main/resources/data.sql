INSERT INTO banner (id, bg, title, text, imgurl)
VALUES (0,
        'linear-gradient(86deg, #FFFEDD 0%, #DDF7FF 100%)',
        'Открыта вакансия',
        'Ищем в команду лучшего кота для разработки котоуслуг',
        'work.png');
INSERT INTO banner (id, bg, title, text, imgurl)
VALUES (1,
        'linear-gradient(86deg, #EDF2FE 0%, #F0FFF2 100%)',
        'Случилось несчастье',
        'Новая услуга на портале «Регистрация усопшего» поможет легко и быстро разобраться с документами',
        'ghost.png');
INSERT INTO banner (id, bg, title, text, imgurl)
VALUES (2,
        'linear-gradient(86deg, #EDF2FE 0%, #D7E7FF 100%)',
        'Хотите завести котёнка?',
        'Услуга «Укотоение» поможет подобрать кото-приют и котёнка',
        'hugs.png');

/*-- cat
INSERT INTO cat (id, name, age, sex, breed)
VALUES (0,
        'Феликс',
        '1',
        'male',
        'british_shorthair');
INSERT INTO cat (id, name, age, sex, breed)
VALUES (1,
        'Муся',
        '1',
        'female',
        'maine_coon');*/

-- service
INSERT INTO service(id, mnemonic, icon, title, description)
VALUES (0,
        'new_family',
        'cupid.png',
        'Регистрация брака',
        'Вступайте в брак легко и быстро с котоуслугами');
INSERT INTO service(id, mnemonic, icon, title, description)
VALUES (1,
        'vet',
        'sick.webp',
        'Запись на прием к ветеринару',
        'Подходи ответственно к своему здоровью. Здоровый ты - здоровая страна');
INSERT INTO service(id, mnemonic, icon, title, description)
VALUES (2,
        'spa',
        'relax.png',
        'SPA-процедуры',
        'Устали от бесконечной работы и гонки за мышами? Пора записаться на расслабляющие процедуры');
INSERT INTO service(id, mnemonic, icon, title, description)
VALUES (3,
        'food',
        'eating.png',
        'Заказ еды',
        'Ваш питомец проголодался? Закажите котику покушать!');

-- category
INSERT INTO category
VALUES (0, 'Семья и дети');
INSERT INTO category
VALUES (1, 'Медицина');
INSERT INTO category
VALUES (2, 'Отдых и развлечение');
INSERT INTO category
VALUES (3, 'Питание');

-- service_to_category
INSERT INTO service_category
VALUES (0, 0);
INSERT INTO service_category
VALUES (1, 1);
INSERT INTO service_category
VALUES (2, 2);
INSERT INTO service_category
VALUES (3, 3);
