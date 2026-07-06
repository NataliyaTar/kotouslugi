-- Idempotent seed data for PostgreSQL (ON CONFLICT / NOT EXISTS)

-- banners
INSERT INTO banner (id, bg, title, text, imgurl) VALUES
(0, 'linear-gradient(86deg, #FFFEDD 0%, #DDF7FF 100%)', 'Открыта вакансия', 'Ищем в команду лучшего кота для разработки котоуслуг', 'work.png'),
(1, 'linear-gradient(86deg, #EDF2FE 0%, #F0FFF2 100%)', 'Случилось несчастье', 'Новая услуга на портале «Регистрация усопшего» поможет легко и быстро разобраться с документами', 'ghost.png'),
(2, 'linear-gradient(86deg, #EDF2FE 0%, #D7E7FF 100%)', 'Хотите завести котёнка?', 'Услуга «Укотоение» поможет подобрать кото-приют и котёнка', 'hugs.png')
ON CONFLICT (id) DO NOTHING;

-- demo cats
INSERT INTO cat (id, name, age, sex, breed) VALUES
(1, 'Феликс', '2', 'male', 'british_shorthair'),
(2, 'Муся', '1', 'female', 'maine_coon'),
(3, 'Барсик', '3', 'male', 'siamese'),
(4, 'Лада', '4', 'female', 'persian')
ON CONFLICT (id) DO NOTHING;

-- services
INSERT INTO service (id, mnemonic, icon, title, description) VALUES
(0, 'animal_passport', 'passport.png', 'Единый реестр паспортов животных', 'Оцифруйте паспорт питомца: прививки, родословная, история болезней и контроль инбридинга'),
(1, 'drug_registry', 'drug_registry.png', 'Реестр ветеринарных препаратов', 'Проверьте подлинность ветпрепарата по коду партии и сообщите о подозрительной продукции'),
(2, 'new_family', 'cupid.png', 'Регистрация брака', 'Вступайте в брак легко и быстро с котоуслугами'),
(3, 'vet', 'sick.webp', 'Запись на прием к ветеринару', 'Подходи ответственно к своему здоровью. Здоровый ты - здоровая страна'),
(4, 'spa', 'relax.png', 'SPA-процедуры', 'Устали от бесконечной работы и гонки за мышами? Пора записаться на расслабляющие процедуры')
ON CONFLICT (id) DO NOTHING;

-- categories
INSERT INTO category (id, name) VALUES
(0, 'Семья и дети'),
(1, 'Медицина'),
(2, 'Отдых и развлечение')
ON CONFLICT (id) DO NOTHING;

-- service <-> category links (column FK mapping per JPA JoinTable in project)
INSERT INTO service_category (category_id, service_id)
SELECT 2, 0 WHERE NOT EXISTS (SELECT 1 FROM service_category WHERE category_id = 2 AND service_id = 0);
INSERT INTO service_category (category_id, service_id)
SELECT 3, 1 WHERE NOT EXISTS (SELECT 1 FROM service_category WHERE category_id = 3 AND service_id = 1);
INSERT INTO service_category (category_id, service_id)
SELECT 4, 2 WHERE NOT EXISTS (SELECT 1 FROM service_category WHERE category_id = 4 AND service_id = 2);
INSERT INTO service_category (category_id, service_id)
SELECT 0, 1 WHERE NOT EXISTS (SELECT 1 FROM service_category WHERE category_id = 0 AND service_id = 1);
INSERT INTO service_category (category_id, service_id)
SELECT 1, 1 WHERE NOT EXISTS (SELECT 1 FROM service_category WHERE category_id = 1 AND service_id = 1);

-- manufacturers
INSERT INTO manufacturer (id, name, inn, country, contact_info, type, trust_rating) VALUES
(0, 'КотоФарм', '7701234567', 'Россия', 'info@kotopharm.ru', 'MANUFACTURER', 4.8),
(1, 'ВетИмпорт', '7709876543', 'Германия', 'sales@vetimport.de', 'IMPORTER', 4.5)
ON CONFLICT (id) DO NOTHING;

-- drugs
INSERT INTO drug (id, manufacturer_id, trade_name, inn_name, form_type) VALUES
(0, 0, 'МурБиовак', 'инактивированная вакцина', 'раствор для инъекций'),
(1, 1, 'КотоАнтигельминт', 'празиквантел', 'таблетки')
ON CONFLICT (id) DO NOTHING;

-- drug batches
INSERT INTO drug_batch (id, drug_id, batch_code, serial_number, expiry_date, status) VALUES
(0, 0, 'MBV-2026-001', 'SN-10001', '2027-12-31', 'ACTIVE'),
(1, 0, 'MBV-2025-OLD', 'SN-09999', '2024-01-01', 'EXPIRED'),
(2, 1, 'KAG-2026-042', 'SN-20042', '2028-06-30', 'ACTIVE'),
(3, 1, 'KAG-RECALL-01', 'SN-20000', '2027-03-15', 'RECALLED')
ON CONFLICT (id) DO NOTHING;
