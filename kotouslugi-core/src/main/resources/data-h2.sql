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
        'drug_registry',
        'drug_registry.png',
        'Реестр ветеринарных препаратов',
        'Проверьте подлинность ветпрепарата по коду партии и сообщите о подозрительной продукции');
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

-- manufacturers
INSERT INTO manufacturer (id, name, inn, country, contact_info, type, trust_rating)
values (0, 'КотоФарм', '7701234567', 'Россия', 'info@kotopharm.ru', 'MANUFACTURER', 4.8);
INSERT INTO manufacturer (id, name, inn, country, contact_info, type, trust_rating)
values (1, 'ВетИмпорт', '7709876543', 'Германия', 'sales@vetimport.de', 'IMPORTER', 4.5);

-- drugs
INSERT INTO drug (id, manufacturer_id, trade_name, inn_name, form_type)
values (0, 0, 'МурБиовак', 'инактивированная вакцина', 'раствор для инъекций');
INSERT INTO drug (id, manufacturer_id, trade_name, inn_name, form_type)
values (1, 1, 'КотоАнтигельминт', 'празиквантел', 'таблетки');

-- drug batches (коды для проверки в демо)
INSERT INTO drug_batch (id, drug_id, batch_code, serial_number, expiry_date, status)
values (0, 0, 'MBV-2026-001', 'SN-10001', '2027-12-31', 'ACTIVE');
INSERT INTO drug_batch (id, drug_id, batch_code, serial_number, expiry_date, status)
values (1, 0, 'MBV-2025-OLD', 'SN-09999', '2024-01-01', 'EXPIRED');
INSERT INTO drug_batch (id, drug_id, batch_code, serial_number, expiry_date, status)
values (2, 1, 'KAG-2026-042', 'SN-20042', '2028-06-30', 'ACTIVE');
INSERT INTO drug_batch (id, drug_id, batch_code, serial_number, expiry_date, status)
values (3, 1, 'KAG-RECALL-01', 'SN-20000', '2027-03-15', 'RECALLED');
