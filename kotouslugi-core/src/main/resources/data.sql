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
INSERT INTO service(id, mnemonic, icon, title, description)
values (3,
        'workout',
        'fitness.png',
        'Запись в фитнес-клуб',
        'Тренируйтесь с удовольствием - ваше здоровье начинается здесь!');

-- category
INSERT INTO category
values (0, 'Семья и дети');
INSERT INTO category
values (1, 'Медицина');
INSERT INTO category
values (2, 'Отдых и развлечение');
INSERT INTO category
values (3, 'Спорт');

-- service_to_category
INSERT INTO service_category
values (0, 0);
INSERT INTO service_category
values (1, 1);
INSERT INTO service_category
values (2, 2);
INSERT INTO service_category
values (3, 3);

-- "Свободные места", инициализация спортзалов
--INSERT INTO fitness(ID, FITNESS_CLUB, MEMBERSHIP_TYPE, PRICE)
--    VALUES(1, 'Большой котовий фитнес-клуб', 0, 2000.15);

--INSERT INTO fitness(ID, FITNESS_CLUB, MEMBERSHIP_TYPE, PRICE)
 --   VALUES(2, 'Классный теннисный корт', 1, 1543.45);

--INSERT INTO fitness(ID, FITNESS_CLUB, MEMBERSHIP_TYPE, PRICE)
--    VALUES(3, 'Когтеточка', 2, 1423.44);

-- Новая структура для фитнес-клубов, абонементов, типов тренировок и тренеров

-- 1. Клубы
INSERT INTO fitness_club (id, name) VALUES (1, 'Большой котовий фитнес-клуб');
INSERT INTO fitness_club (id, name) VALUES (2, 'Классный теннисный корт');
INSERT INTO fitness_club (id, name) VALUES (3, 'Когтеточка');

-- 2. Типы тренировок для каждого клуба
INSERT INTO fitness_club_training_types (fitness_club_id, training_type) VALUES (1, 'GROUP');
INSERT INTO fitness_club_training_types (fitness_club_id, training_type) VALUES (1, 'PERSONAL');
INSERT INTO fitness_club_training_types (fitness_club_id, training_type) VALUES (1, 'FREE');
INSERT INTO fitness_club_training_types (fitness_club_id, training_type) VALUES (2, 'GROUP');
INSERT INTO fitness_club_training_types (fitness_club_id, training_type) VALUES (2, 'PERSONAL');
INSERT INTO fitness_club_training_types (fitness_club_id, training_type) VALUES (2, 'FREE');
INSERT INTO fitness_club_training_types (fitness_club_id, training_type) VALUES (3, 'GROUP');
INSERT INTO fitness_club_training_types (fitness_club_id, training_type) VALUES (3, 'PERSONAL');
INSERT INTO fitness_club_training_types (fitness_club_id, training_type) VALUES (3, 'FREE');

-- 3. Абонементы для каждого клуба
-- Большой котовий фитнес-клуб
INSERT INTO membership (id, duration_months, price, fitness_club_id) VALUES (1, 1, 3000, 1);
INSERT INTO membership (id, duration_months, price, fitness_club_id) VALUES (2, 6, 6000, 1);
INSERT INTO membership (id, duration_months, price, fitness_club_id) VALUES (3, 12, 11000, 1);
-- Классный теннисный корт
INSERT INTO membership (id, duration_months, price, fitness_club_id) VALUES (4, 1, 2500, 2);
INSERT INTO membership (id, duration_months, price, fitness_club_id) VALUES (5, 6, 5000, 2);
INSERT INTO membership (id, duration_months, price, fitness_club_id) VALUES (6, 12, 10000, 2);
-- Когтеточка
INSERT INTO membership (id, duration_months, price, fitness_club_id) VALUES (7, 1, 2600, 3);
INSERT INTO membership (id, duration_months, price, fitness_club_id) VALUES (8, 6, 6200, 3);
INSERT INTO membership (id, duration_months, price, fitness_club_id) VALUES (9, 12, 11300, 3);

-- 4. Кото-тренеры для каждого клуба (по 5 на клуб)
-- Большой котовий фитнес-клуб
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (10, 'Барсик', '2', 'male', 'siberian', 1);
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (11, 'Мурзик', '3', 'male', 'maine_coon', 1);
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (12, 'Снежок', '1', 'male', 'british_shorthair', 1);
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (13, 'Лапка', '2', 'female', 'siamese', 1);
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (14, 'Пушинка', '4', 'female', 'persian', 1);
-- Классный теннисный корт
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (15, 'Теннис', '2', 'male', 'oriental', 2);
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (16, 'Ракетка', '3', 'female', 'bengal', 2);
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (17, 'Мячик', '1', 'male', 'scottish_fold', 2);
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (18, 'Сетка', '2', 'female', 'russian_blue', 2);
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (19, 'Корт', '4', 'male', 'abyssinian', 2);
-- Когтеточка
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (20, 'Коготь', '2', 'male', 'siberian', 3);
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (21, 'Точка', '3', 'female', 'maine_coon', 3);
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (22, 'Шерстяной', '1', 'male', 'british_shorthair', 3);
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (23, 'Мурлыка', '2', 'female', 'siamese', 3);
INSERT INTO cat (id, name, age, sex, breed, fitness_club_id) VALUES (24, 'Царапка', '4', 'female', 'persian', 3);
