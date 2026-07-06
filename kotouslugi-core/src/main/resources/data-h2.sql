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

-- demo cats for testing
INSERT INTO cat (id, name, age, sex, breed)
values (1, 'Феликс', '2', 'male', 'british_shorthair');
INSERT INTO cat (id, name, age, sex, breed)
values (2, 'Муся', '1', 'female', 'maine_coon');
INSERT INTO cat (id, name, age, sex, breed)
values (3, 'Барсик', '3', 'male', 'siamese');
INSERT INTO cat (id, name, age, sex, breed)
values (4, 'Лада', '4', 'female', 'persian');

-- service
INSERT INTO service(id, mnemonic, icon, title, description)
values (0,
        'animal_passport',
        'passport.png',
        'Единый реестр паспортов животных',
        'Оцифруйте паспорт питомца: прививки, родословная, история болезней и контроль инбридинга');
INSERT INTO service(id, mnemonic, icon, title, description)
values (1,
        'grooming_booking',
        'relax2.png',
        'Запись к грумеру',
        'Запишите питомца в салон, выберите время и грумера, получите подтверждение и уведомления');
INSERT INTO service(id, mnemonic, icon, title, description)
values (2,
        'new_family',
        'cupid.png',
        'Регистрация брака',
        'Вступайте в брак легко и быстро с котоуслугами');
INSERT INTO service(id, mnemonic, icon, title, description)
values (3,
        'vet',
        'sick.webp',
        'Запись на прием к ветеринару',
        'Подходи ответственно к своему здоровью. Здоровый ты - здоровая страна');
INSERT INTO service(id, mnemonic, icon, title, description)
values (4,
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
values (0, 1);
INSERT INTO service_category
values (1, 1);
INSERT INTO service_category
values (2, 0);
INSERT INTO service_category
values (3, 1);
INSERT INTO service_category
values (4, 2);
-- remove legacy drug registry if left from old data
DELETE FROM service_category
WHERE category_id IN (SELECT id FROM service WHERE mnemonic = 'drug_registry');
DELETE FROM service
WHERE mnemonic = 'drug_registry';

-- keep grooming review merged into grooming booking page
DELETE FROM service_category
WHERE category_id IN (SELECT id FROM service WHERE mnemonic = 'grooming_review');
DELETE FROM service
WHERE mnemonic = 'grooming_review';

-- grooming salons
INSERT INTO grooming_salon (id, name, address, contact_phone, available_times, provides_groomers)
values (0, 'Лапки-Ножницы', 'Москва, ул. Мур-мур, 7', '74951234567', '09:00,11:00,13:00,15:00,17:00', true);
INSERT INTO grooming_salon (id, name, address, contact_phone, available_times, provides_groomers)
values (1, 'Котополис Grooming', 'Москва, пр. Когтистый, 15', '74957654321', '10:00,12:00,14:00,16:00,18:00', true);
INSERT INTO grooming_salon (id, name, address, contact_phone, available_times, provides_groomers)
values (2, 'Пушистый стиль', 'Москва, ул. Хвостатая, 3', '74959876543', '10:30,13:30,16:30', false);

-- groomers
INSERT INTO groomer (id, salon_id, full_name, specialization, rating)
values (0, 0, 'Котова Анна Сергеевна', 'Стрижка длинношерстных', 4.9);
INSERT INTO groomer (id, salon_id, full_name, specialization, rating)
values (1, 0, 'Мяукин Петр Игоревич', 'Гигиенический уход', 4.7);
INSERT INTO groomer (id, salon_id, full_name, specialization, rating)
values (2, 1, 'Барсикова Елена Викторовна', 'Выставочный груминг', 4.8);
INSERT INTO groomer (id, salon_id, full_name, specialization, rating)
values (3, 1, 'Лапина Дарья Олеговна', 'Экспресс-уход', 4.6);
