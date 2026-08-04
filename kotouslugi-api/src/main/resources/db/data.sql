INSERT INTO banner (id, title, text, bg, imgurl) VALUES (1, 'Открыта вакансия', 'Ищем в команду лучшего кота для разработки котоуслуг', 'linear-gradient(86deg, #FFFEDD 0%, #DDF7FF 100%)', 'work.png');
INSERT INTO banner (id, title, text, bg, imgurl) VALUES (2, 'Хотите завести котёнка?', 'Услуга «Укотоение» поможет подобрать кото-приют и котёнка', 'linear-gradient(86deg, #EDF2FE 0%, #D7E7FF 100%)', 'hugs.png');
INSERT INTO banner (id, title, text, bg, imgurl) VALUES (3, 'Готов покорить подиум?', 'Участвуй в официальной кошачьей выставке и покажи себя!', 'linear-gradient(86deg, #FFF9E6 0%, #FFEFD5 100%)', 'cinema.png');

INSERT INTO category (id, name) VALUES (1, 'Семья и дети');
INSERT INTO category (id, name) VALUES (2, 'Медицина');
INSERT INTO category (id, name) VALUES (3, 'Отдых и развлечение');

INSERT INTO service (id, title, description, icon, mnemonic) VALUES (1, 'Регистрация брака', 'Вступайте в брак легко и быстро с котоуслугами', 'cupid.png', 'marriage');
INSERT INTO service (id, title, description, icon, mnemonic) VALUES (2, 'Запись к ветеринару', 'Подходи ответственно к своему здоровью.', 'sick.webp', 'vet');
INSERT INTO service (id, title, description, icon, mnemonic) VALUES (3, 'SPA-процедуры', 'Устали от бесконечной работы? Пора записаться на расслабление', 'relax.png', 'spa');
INSERT INTO service (id, title, description, icon, mnemonic) VALUES (4, 'Участие в выставке', 'Покажите своего кота всему миру на официальной выставке', 'cinema.png', 'exhibition');
INSERT INTO service (id, title, description, icon, mnemonic) VALUES (5, 'Подбор партнёра', 'Найдем идеальную пару среди зарегистрированных котиков', 'hugs.png', 'breeding');
INSERT INTO service_category (category_id, service_id) VALUES (1, 1);
INSERT INTO service_category (category_id, service_id) VALUES (2, 2);
INSERT INTO service_category (category_id, service_id) VALUES (3, 3);
INSERT INTO service_category (category_id, service_id) VALUES (4, 3);
INSERT INTO service_category (category_id, service_id) VALUES (5, 1);

INSERT INTO cat (id, name, age, breed, sex) VALUES (1, 'Борис', '3 года', 'Мейн-кун', 'М');
INSERT INTO cat (id, name, age, breed, sex) VALUES (2, 'Мурка', '1 год', 'Сиамская', 'Ж');


-- ВЫСТАВКИ

INSERT INTO exhibitions (id, name, date, city, system, organizer, cost, deadline)
VALUES (1, 'Международная выставка «Кубок Пушистых»', '15.08.2026', 'Москва', 'WCF', 'Клуб Котофей', '2500 руб.', '10.08.2026');

INSERT INTO exhibitions (id, name, date, city, system, organizer, cost, deadline)
VALUES (2, 'Всероссийский смотр «Усы и Лапы»', '20.09.2026', 'Санкт-Петербург', 'FIFe', 'ЛенКотоСоюз', '1800 руб.', '15.09.2026');


-- АНКЕТЫ ДЛЯ ВЯЗКИ

INSERT INTO breeding_profiles (id, breed, gender, city, age, has_pedigree, target_breed, target_city, min_age, max_age, status)
VALUES (1, 'Британская', 'FEMALE', 'Москва', 2, true, 'Британская', 'Москва', 1, 5, 'ACTIVE');

INSERT INTO breeding_profiles (id, breed, gender, city, age, has_pedigree, target_breed, target_city, min_age, max_age, status)
VALUES (2, 'Британская', 'MALE', 'Москва', 3, true, 'Британская', 'Москва', 1, 5, 'ACTIVE');

ALTER TABLE breeding_profiles ALTER COLUMN id RESTART WITH 3;


-- ЗАПРОСЫ НА ВЯЗКУ

INSERT INTO breeding_requests (id, sender_profile_id, receiver_profile_id, status)
VALUES (1, 2, 1, 'PENDING');

ALTER TABLE breeding_requests ALTER COLUMN id RESTART WITH 2;
