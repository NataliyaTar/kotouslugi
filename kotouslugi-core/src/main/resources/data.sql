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

-- баннер К-ЕГЭ
INSERT INTO banner (id, bg, title, text, imgurl)
values (3,
        'linear-gradient(86deg, #EDF2FE 0%, #FFDDE8 100%)',
        'Узнайте результаты К-ЕГЭ!',
        'Новая услуга «Результаты К-ЕГЭ» отобразит текущие баллы по экзаменам и поможет с выбором подходящего Кото-Вуза',
        'read.png');


INSERT INTO cat (id, name, age, sex, breed)
values (0,
        'Феликс',
        '1',
        'male',
        'british_shorthair');

 /*-- cat
INSERT INTO cat (id, name, age, sex, breed)
values (1,
        'Муся',
        '1',
        'female',
        'maine_coon');
 */


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

-- котоуслуга "К-ЕГЭ"
INSERT INTO service(id, mnemonic, icon, title, description)
values (3,
        'exams', /* ИЗМЕНИТЬ НА exams ВМЕСТО education!!!*/
        'student.png',
        'Результаты К-ЕГЭ',
        'Узнай баллы по К-ЕГЭ и выбери подходящий для поступления Кото-ВУЗ вместе с котоуслугами!');

-- category
INSERT INTO category
values (0, 'Семья и дети');
INSERT INTO category
values (1, 'Медицина');
INSERT INTO category
values (2, 'Отдых и развлечение');
--категория К-ЕГЭ
INSERT INTO category
values (3, 'Образование');

-- service_to_category
INSERT INTO service_category
values (0, 0);
INSERT INTO service_category
values (1, 1);
INSERT INTO service_category
values (2, 2);
/* Для К-ЕГЭ */
INSERT INTO service_category
values (3, 3);

/*-- exams_for_cat_id0*/
INSERT INTO Exam (Exam_ID, Subject_Name, Score, ID_Cat) VALUES (1, 'Математика', 85, 0);
INSERT INTO Exam (Exam_ID, Subject_Name, Score, ID_Cat) VALUES (2, 'Русский язык', 90, 0);
INSERT INTO Exam (Exam_ID, Subject_Name, Score, ID_Cat) VALUES (3, 'Информатика', 73, 0);
INSERT INTO Exam (Exam_ID, Subject_Name, Score, ID_Cat) VALUES (4, 'Физика', 100, 0);

/*-- information_for_universities*/
INSERT INTO University (ID_University, University_Name, University_Score) VALUES (1, 'МГкУ имени Барсика', 400);
INSERT INTO University (ID_University, University_Name, University_Score) VALUES (2, 'Мур-Мяу Университет', 390);
INSERT INTO University (ID_University, University_Name, University_Score) VALUES (3, 'Пушистый Государственный Университет', 380);
INSERT INTO University (ID_University, University_Name, University_Score) VALUES (4, 'Академия Лапочек и Усиков', 370);
INSERT INTO University (ID_University, University_Name, University_Score) VALUES (5, 'Ушастый Университет Наук', 360);
INSERT INTO University (ID_University, University_Name, University_Score) VALUES (6, 'КотоГрадский Институт Искусств', 350);
INSERT INTO University (ID_University, University_Name, University_Score) VALUES (7, 'Институт Котоведения', 340);
INSERT INTO University (ID_University, University_Name, University_Score) VALUES (8, 'Университет КотоГения', 330);
INSERT INTO University (ID_University, University_Name, University_Score) VALUES (9, 'Мяуксфордский Университет', 320);
INSERT INTO University (ID_University, University_Name, University_Score) VALUES (10, 'Институт Бархатных Лапок', 310);
INSERT INTO University (ID_University, University_Name, University_Score) VALUES (11, 'Муррский Университет Инноваций', 355);
