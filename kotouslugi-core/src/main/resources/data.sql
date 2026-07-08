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

-- category
INSERT INTO category
values (0, 'Семья и дети');
INSERT INTO category
values (1, 'Медицина');
INSERT INTO category
values (2, 'Отдых и развлечение');

-- service_to_category
INSERT INTO service_category
values (0, 0);
INSERT INTO service_category
values (1, 1);
INSERT INTO service_category
values (2, 2);

-- fine (штрафы котов)
INSERT INTO fine (id, cat_id, reason, amount, status, created)
values (0, 0, 'Порча мебели когтями', 500, 'UNPAID', '2024-06-01 10:00:00');
INSERT INTO fine (id, cat_id, reason, amount, status, created)
values (1, 0, 'Охота на мышей без лицензии', 1000, 'UNPAID', '2024-06-02 12:30:00');
INSERT INTO fine (id, cat_id, reason, amount, status, created)
values (2, 1, 'Нарушение тишины после 23:00 (громкое мяуканье)', 300, 'PAID', '2024-06-03 09:15:00');
INSERT INTO fine (id, cat_id, reason, amount, status, created)
values (3, 1, 'Несанкционированная парковка на клавиатуре хозяина', 250, 'UNPAID', '2024-06-04 18:45:00');
