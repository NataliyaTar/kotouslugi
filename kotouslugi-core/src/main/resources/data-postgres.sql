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
(1, 'grooming_booking', 'relax2.png', 'Запись к грумеру', 'Запишите питомца в салон, выберите время и грумера, получите подтверждение и уведомления'),
(2, 'new_family', 'cupid.png', 'Регистрация брака', 'Вступайте в брак легко и быстро с котоуслугами'),
(3, 'vet', 'sick.webp', 'Запись на прием к ветеринару', 'Подходи ответственно к своему здоровью. Здоровый ты - здоровая страна'),
(4, 'spa', 'relax.png', 'SPA-процедуры', 'Устали от бесконечной работы и гонки за мышами? Пора записаться на расслабляющие процедуры')
ON CONFLICT (id) DO NOTHING;

-- force replace old drug registry service on existing databases
UPDATE service
SET mnemonic = 'grooming_booking',
    icon = 'relax2.png',
    title = 'Запись к грумеру',
    description = 'Запишите питомца в салон, выберите время и грумера, получите подтверждение и уведомления'
WHERE id = 1;

-- hard delete legacy drug registry service
DELETE FROM service_category
WHERE category_id IN (SELECT id FROM service WHERE mnemonic = 'drug_registry');
DELETE FROM service
WHERE mnemonic = 'drug_registry';

-- keep grooming review merged into grooming booking page
DELETE FROM service_category
WHERE category_id IN (SELECT id FROM service WHERE mnemonic = 'grooming_review');
DELETE FROM service
WHERE mnemonic = 'grooming_review';

-- ensure vet and spa services are present in legacy DBs
INSERT INTO service (mnemonic, icon, title, description)
SELECT 'vet', 'sick.webp', 'Запись на прием к ветеринару', 'Подходи ответственно к своему здоровью. Здоровый ты - здоровая страна'
WHERE NOT EXISTS (SELECT 1 FROM service WHERE mnemonic = 'vet');
INSERT INTO service (mnemonic, icon, title, description)
SELECT 'spa', 'relax.png', 'SPA-процедуры', 'Устали от бесконечной работы и гонки за мышами? Пора записаться на расслабляющие процедуры'
WHERE NOT EXISTS (SELECT 1 FROM service WHERE mnemonic = 'spa');

-- keep only one row per mnemonic (legacy DBs may have duplicates)
DELETE FROM service_category
WHERE category_id IN (
    SELECT s.id
    FROM service s
             JOIN (
        SELECT mnemonic, MIN(id) AS keep_id
        FROM service
        GROUP BY mnemonic
        HAVING COUNT(*) > 1
    ) d ON d.mnemonic = s.mnemonic
    WHERE s.id <> d.keep_id
);

DELETE FROM service s
USING (
    SELECT mnemonic, MIN(id) AS keep_id
    FROM service
    GROUP BY mnemonic
    HAVING COUNT(*) > 1
) d
WHERE s.mnemonic = d.mnemonic
  AND s.id <> d.keep_id;

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

-- grooming salons
INSERT INTO grooming_salon (id, name, address, contact_phone, available_times, provides_groomers) VALUES
(0, 'Лапки-Ножницы', 'Москва, ул. Мур-мур, 7', '74951234567', '09:00,11:00,13:00,15:00,17:00', true),
(1, 'Котополис Grooming', 'Москва, пр. Когтистый, 15', '74957654321', '10:00,12:00,14:00,16:00,18:00', true),
(2, 'Пушистый стиль', 'Москва, ул. Хвостатая, 3', '74959876543', '10:30,13:30,16:30', false)
ON CONFLICT (id) DO NOTHING;

-- groomers
INSERT INTO groomer (id, salon_id, full_name, specialization, rating) VALUES
(0, 0, 'Котова Анна Сергеевна', 'Стрижка длинношерстных', 4.9),
(1, 0, 'Мяукин Петр Игоревич', 'Гигиенический уход', 4.7),
(2, 1, 'Барсикова Елена Викторовна', 'Выставочный груминг', 4.8),
(3, 1, 'Лапина Дарья Олеговна', 'Экспресс-уход', 4.6)
ON CONFLICT (id) DO NOTHING;
