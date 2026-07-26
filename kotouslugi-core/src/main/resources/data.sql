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

-- license_category (категории водительских прав с минимальным возрастом)
INSERT INTO license_category (id, code, name, min_age) VALUES (0,  'A',  'Мотоциклы',              2);
INSERT INTO license_category (id, code, name, min_age) VALUES (1,  'A1', 'Лёгкие мотоциклы',       1);
INSERT INTO license_category (id, code, name, min_age) VALUES (2,  'B',  'Легковые автомобили',    2);
INSERT INTO license_category (id, code, name, min_age) VALUES (3,  'B1', 'Квадроциклы и трициклы', 2);
INSERT INTO license_category (id, code, name, min_age) VALUES (4,  'C',  'Грузовые автомобили',    3);
INSERT INTO license_category (id, code, name, min_age) VALUES (5,  'C1', 'Лёгкие грузовики',       2);
INSERT INTO license_category (id, code, name, min_age) VALUES (6,  'D',  'Автобусы',               4);
INSERT INTO license_category (id, code, name, min_age) VALUES (7,  'D1', 'Микроавтобусы',          3);
INSERT INTO license_category (id, code, name, min_age) VALUES (8,  'BE', 'Легковые с прицепом',    2);
INSERT INTO license_category (id, code, name, min_age) VALUES (9,  'CE', 'Грузовые с прицепом',    3);
INSERT INTO license_category (id, code, name, min_age) VALUES (10, 'DE', 'Автобусы с прицепом',    4);

-- driving_school (автошколы)
INSERT INTO driving_school (id, name, overall_rating, max_per_slot) VALUES (0, 'Автошкола №1', 0.0, 3);
INSERT INTO driving_school (id, name, overall_rating, max_per_slot) VALUES (1, 'Автошкола №2', 0.0, 2);
INSERT INTO driving_school (id, name, overall_rating, max_per_slot) VALUES (2, 'Автошкола №3', 0.0, 5);

-- добавление новых строк
INSERT INTO service(id, mnemonic, icon, title, description)
values (3,
        'driving-license',
        'driving_cat.png',
        'Водительские права',
        'Устали ходить пешком или ждать пустой автобус? Получите права и передвигайтесь с удовольствием');
