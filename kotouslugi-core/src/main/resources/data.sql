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
INSERT INTO banner (id, bg, title, text, imgurl)
values (3,
        'linear-gradient(86deg, #FFF9E6 0%, #FFEFD5 100%)',
        'Готов покорить подиум?',
        'Участвуй в официальной кошачьей выставке и покажи себя во всей красе',
        'cinema.png');

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
        'exhibition',
        'cool.png',
        'Участие в выставке',
        'Покажи себя во всей красе на официальной выставке');
INSERT INTO service(id, mnemonic, icon, title, description)
values (4,
        'breeding_partner',
        'awww.png',
        'Подбор партнёра для разведения',
        'Найдём тебе идеальную пару среди зарегистрированных котиков');

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
INSERT INTO exhibitions (name, date, city, system, organizer, cost, deadline)
VALUES ('Международная выставка «Кубок Пушистых»', '15.08.2026', 'Москва', 'WCF', 'Клуб Котофей', '2500 руб.', '10.08.2026');

INSERT INTO exhibitions (name, date, city, system, organizer, cost, deadline)
VALUES ('Всероссийский смотр «Усы и Лапы»', '20.09.2026', 'Санкт-Петербург', 'FIFe', 'ЛенКотоСоюз', '1800 руб.', '15.09.2026');

-- breeding (анкеты для вязки)
-- Кошка Муся, британка из Москвы (Ищет британца от 1 до 5 лет)
INSERT INTO breeding_profiles (id, breed, gender, city, age, has_pedigree, target_breed, target_city, min_age, max_age, status)
VALUES (1, 'Британская', 'FEMALE', 'Москва', 2, true, 'Британская', 'Москва', 1, 5, 'ACTIVE');

-- Кот Борис, британец из Москвы
INSERT INTO breeding_profiles (id, breed, gender, city, age, has_pedigree, target_breed, target_city, min_age, max_age, status)
VALUES (2, 'Британская', 'MALE', 'Москва', 3, true, 'Британская', 'Москва', 1, 5, 'ACTIVE');

-- Кот Барсик, мейн-кун из Воронежа
INSERT INTO breeding_profiles (id, breed, gender, city, age, has_pedigree, target_breed, target_city, min_age, max_age, status)
VALUES (3, 'Мейн-кун', 'MALE', 'Воронеж', 4, false, 'Мейн-кун', 'Воронеж', 2, 6, 'ACTIVE');

-- ID проставлены вручную, поэтому сдвигаем автоинкремент, иначе следующая реальная анкета
-- упадёт с ошибкой "нарушение первичного ключа"
ALTER TABLE breeding_profiles ALTER COLUMN id RESTART WITH 4;

-- breeding_requests (тестовый запрос на вязку)
-- Кот Борис (ID 2) отправляет предложение кошке Мусе (ID 1)
INSERT INTO breeding_requests (id, sender_profile_id, receiver_profile_id, status)
VALUES (1, 2, 1, 'PENDING');

ALTER TABLE breeding_requests ALTER COLUMN id RESTART WITH 2;
