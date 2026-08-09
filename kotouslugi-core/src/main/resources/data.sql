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

/*-- cat */
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
/*
Тут данные для ячейки нашей услуги
*/
INSERT INTO service(id, mnemonic, icon, title, description)
values (3,
        'entertainment',
        'relax2.png',
        'Культура и развлечения',
        'Культурный отдых и развлечения с близкими!');

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
/*Тут добавил нашу услугу в фильтр*/
INSERT INTO service_category
values (3, 2);

INSERT INTO venue (id, name) values (0, 'Художественный музей им. Крамского');
INSERT INTO venue (id, name) values (1, 'Кинотеатр "Спартак"');
INSERT INTO venue (id, name) values (2, 'Театр оперы и балета');

INSERT INTO events_catalog (id, venue_id, name, price, available_slots)
values (0, 0, 'Выставка "Русский пейзаж 19-го века"', 300.00, '2026-08-08T10:00:00,2026-08-08T14:00:00,2026-08-09T12:00:00');
INSERT INTO events_catalog (id, venue_id, name, price, available_slots)
values (1, 0, 'Экскурсия "Шедевры Крамского"', 350.00, '2026-08-09T15:00:00,2026-08-10T11:00:00,2026-08-10T16:00:00');
INSERT INTO events_catalog (id, venue_id, name, price, available_slots)
values (2, 0, 'Экскурсия "Археологические древности юга России"', 350.00, '2026-08-11T13:00:00,2026-08-11T17:00:00,2026-08-12T10:00:00');
INSERT INTO events_catalog (id, venue_id, name, price, available_slots)
values (3, 1, 'Гарри Поттер и философский камень', 400.00, '2026-08-08T18:00:00,2026-08-08T20:30:00,2026-08-09T15:00:00');
INSERT INTO events_catalog (id, venue_id, name, price, available_slots)
values (4, 1, 'Майкл', 400.00, '2026-08-09T19:00:00,2026-08-10T17:00:00,2026-08-10T21:00:00');
INSERT INTO events_catalog (id, venue_id, name, price, available_slots)
values (5, 1, 'Кот в сапогах: Последнее желание', 400.00, '2026-08-11T11:00:00,2026-08-11T14:00:00,2026-08-12T12:30:00');
INSERT INTO events_catalog (id, venue_id, name, price, available_slots)
values (6, 2, 'Балет "Лебединое озеро"', 800.00, '2026-08-08T19:00:00,2026-08-09T18:00:00,2026-08-10T19:00:00');
INSERT INTO events_catalog (id, venue_id, name, price, available_slots)
values (7, 2, 'Опера "Евгений Онегин"', 800.00, '2026-08-11T18:30:00,2026-08-12T18:30:00,2026-08-13T18:30:00');
INSERT INTO events_catalog (id, venue_id, name, price, available_slots)
values (8, 2, 'Детский спектакль "Золушка"', 500.00, '2026-08-09T11:00:00,2026-08-10T11:00:00,2026-08-11T11:00:00');

