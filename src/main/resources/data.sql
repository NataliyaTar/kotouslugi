-- banners
INSERT INTO banner (id, bg, title, text, imgurl) values (
  0,
  'linear-gradient(86deg, #FFFEDD 0%, #DDF7FF 100%)',
  'Открыта вакансия',
  'Ищем в команду лучшего кота для разработки котоуслуг',
  'work.png'
);
INSERT INTO banner (id, bg, title, text, imgurl) values (
  1,
  'linear-gradient(86deg, #EDF2FE 0%, #F0FFF2 100%)',
  'Случилось несчастье',
  'Новая услуга на портале «Регистрация усопшего» поможет легко и быстро разобраться с документами',
  'ghost.png'
);
INSERT INTO banner (id, bg, title, text, imgurl) values (
  2,
  'linear-gradient(86deg, #EDF2FE 0%, #D7E7FF 100%)',
  'Хотите завести котёнка?',
  'Услуга «Укотоение» поможет подобрать кото-приют и котёнка',
  'hugs.png'
);

-- cat
INSERT INTO cat (id, name, age, sex, breed) values (
  0,
  'Феликс',
  '1',
  'male',
  'british_shorthair'
);

-- service
INSERT INTO service values (
  0,
  'new_family',
  'cupid.png',
  'Регистрация брака',
  'Вступайте в брак легко и быстро с котоуслугами'
);
/*INSERT INTO service
values (1,
        'Подходи ответственно к здоровью питомца. Здоровый кот - мало хлопот.',
        'Запись на приём к ветеринару');
INSERT INTO service
values (2,
        'Уже забыли как выглядит чистый кот. Тогда мы идём к вам.',
        'Помыть кота');*/


-- category
INSERT INTO category
values (0, 'Семья и дети');
INSERT INTO category
values (1, 'Медицина');
INSERT INTO category
values (2, 'Социальные услуги');
INSERT INTO category
values (3, 'Недвижимость');

-- service_to_category
INSERT INTO service_category
values (0, 0);
/*INSERT INTO service_category
values (1, 1);
INSERT INTO service_category
values (2, 1);
INSERT INTO service_category
values (3, 2);
INSERT INTO service_category
values (4, 2);
INSERT INTO service_category
values (5, 3);*/
