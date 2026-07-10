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

/*-- cat
INSERT INTO cat (id, name, age, sex, breed)
values (0,
        'Феликс',
        '1',
        'male',
        'british_shorthair');
INSERT INTO cat (id, name, age, sex, breed)
values (1,
        'Муся',
        '1',
        'female',
        'maine_coon');*/

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
INSERT INTO service(id, mnemonic, icon, title, description)
values (3,
        'fine_payment',
        'corner.webp',
        'Просмотр и оплата штрафов',
        'Быстрый поиск и оплата штрафов вашего кота');

-- category
INSERT INTO category
values (0, 'Семья и дети');
INSERT INTO category
values (1, 'Медицина');
INSERT INTO category
values (2, 'Отдых и развлечение');
INSERT INTO category
values (3, 'Правопорядок');

-- service_to_category
INSERT INTO service_category
values (0, 0);
INSERT INTO service_category
values (1, 1);
INSERT INTO service_category
values (2, 2);
INSERT INTO service_category
values (3, 3);

-- fine (штрафы котов). cat_id = 1 — первый добавленный кот.
INSERT INTO fine (id, cat_id, reason, amount, status, created)
values (1, 1, 'Порча мебели когтями', 500, 'UNPAID', DATEADD('DAY', -10, CURRENT_TIMESTAMP));
INSERT INTO fine (id, cat_id, reason, amount, status, created)
values (2, 1, 'Охота на мышей без лицензии', 1000, 'UNPAID', DATEADD('DAY', -7, CURRENT_TIMESTAMP));
INSERT INTO fine (id, cat_id, reason, amount, status, created)
values (3, 1, 'Нарушение тишины после 23:00 (громкое мяуканье)', 300, 'UNPAID', DATEADD('DAY', -5, CURRENT_TIMESTAMP));
INSERT INTO fine (id, cat_id, reason, amount, status, created)
values (4, 1, 'Несанкционированная парковка на клавиатуре хозяина', 250, 'PAID', DATEADD('DAY', -2, CURRENT_TIMESTAMP));

-- сид использует id 1-4, поэтому сдвигаем счётчик новых штрафов, чтобы не было конфликта id
ALTER SEQUENCE fine_seq RESTART WITH 100;
