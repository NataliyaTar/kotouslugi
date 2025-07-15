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
        'hotel',
        'relax.png',
        'Отель',
        'Нужно записать котика на передержку? Ваш комфорт - наша забота!');

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

INSERT INTO hotel (id, name, address) VALUES (1, 'КотоОтель Москва', 'Москва, ул. ул. Зои Космодемьянской, д. 60');
INSERT INTO hotel (id, name, address) VALUES (2, 'КотоОтель Санкт-Петербург', 'Санкт-Петербург, ул. алл. Больничная, д. 73');
INSERT INTO hotel (id, name, address) VALUES (3, 'КотоОтель Казань', 'Казань, ул. наб. Привольная, д. 74');
INSERT INTO hotel (id, name, address) VALUES (4, 'КотоОтель Новосибирск', 'Новосибирск, ул. алл. Стахановская, д. 53');
INSERT INTO hotel (id, name, address) VALUES (5, 'КотоОтель Екатеринбург', 'Екатеринбург, ул. ул. Хуторская, д. 57');
INSERT INTO hotel (id, name, address) VALUES (6, 'КотоОтель Нижний Новгород', 'Нижний Новгород, ул. алл. Волгоградская, д. 19');
INSERT INTO hotel (id, name, address) VALUES (7, 'КотоОтель Краснодар', 'Краснодар, ул. ш. Радищева, д. 23');
INSERT INTO hotel (id, name, address) VALUES (8, 'КотоОтель Владивосток', 'Владивосток, ул. алл. Минина, д. 71');
INSERT INTO hotel (id, name, address) VALUES (9, 'КотоОтель Самара', 'Самара, ул. наб. Клубная, д. 59');
INSERT INTO hotel (id, name, address) VALUES (10, 'КотоОтель Пермь', 'Пермь, ул. пер. Слободской, д. 1');

