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
        'spa',
        'relax.png',
        'SPA-процедуры',
        'Устали от бесконечной работы и гонки за мышами? Пора записаться на расслабляющие процедуры');
INSERT INTO service(id, mnemonic, icon, title, description)
values (3,
        'food',
        'eating.png',
        'Заказ еды',
        'Ваш питомец проголодался? Закажите котику покушать!');

-- category
INSERT INTO category
values (0, 'Семья и дети');
INSERT INTO category
values (1, 'Медицина');
INSERT INTO category
values (2, 'Отдых и развлечение');
INSERT INTO category
values (3, 'Питание');

-- service_to_category
INSERT INTO service_category
values (0, 0);
INSERT INTO service_category
values (1, 1);
INSERT INTO service_category
values (2, 2);
INSERT INTO service_category
values (3, 3);

-- Добавляем таблицы для поддержки функционала заказа еды
CREATE TABLE shop (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    city_id INTEGER REFERENCES city(id),
                    address TEXT
);

CREATE TABLE city (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL
);

CREATE TABLE street (
                      id SERIAL PRIMARY KEY,
                      city_id INTEGER REFERENCES city(id),
                      name VARCHAR(255) NOT NULL
);

CREATE TABLE product (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       description TEXT,
                       price DECIMAL(10, 2) NOT NULL,
                       image_url VARCHAR(255),
                       shop_id INTEGER REFERENCES shop(id)
);

CREATE TABLE food_order (
                          id SERIAL PRIMARY KEY,
                          cat_id INTEGER REFERENCES cat(id),
                          owner_name VARCHAR(255) NOT NULL,
                          telephone VARCHAR(20) NOT NULL,
                          email VARCHAR(255),
                          city_id INTEGER REFERENCES city(id),
                          street_id INTEGER REFERENCES street(id),
                          house VARCHAR(20) NOT NULL,
                          apartment VARCHAR(20),
                          shop_id INTEGER REFERENCES shop(id),
                          delivery_type VARCHAR(50) NOT NULL,
                          delivery_date DATE NOT NULL,
                          delivery_time TIME,
                          comment TEXT,
                          status VARCHAR(50) DEFAULT 'Подана',
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          total_price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE order_product (
                             order_id INTEGER REFERENCES food_order(id),
                             product_id INTEGER REFERENCES product(id),
                             quantity INTEGER DEFAULT 1,
                             PRIMARY KEY (order_id, product_id)
);-- Добавляем тестовые города
INSERT INTO city (name) VALUES
                          ('Москва'),
                          ('Санкт-Петербург');

-- Добавляем улицы
INSERT INTO street (city_id, name) VALUES
                                     (1, 'Арбат'),
                                     (1, 'Тверская'),
                                     (2, 'Невский проспект');

-- Добавляем магазины
INSERT INTO shop (name, city_id, address) VALUES
                                            ('Котофей', 1, 'ул. Арбат, д. 12'),
                                            ('Мурмаркет', 2, 'Невский пр-т, д. 45');

-- Добавляем продукты
INSERT INTO product (name, description, price, image_url, shop_id) VALUES
                                                                     ('Вискас', 'Корм для взрослых кошек', 350.0, 'whiskas.jpg', 1),
                                                                     ('Royal Canin', 'Премиум корм для котят', 1200.0, 'royal.jpg', 1),
                                                                     ('Purina', 'Корм с лососем', 780.0, 'purina.jpg', 2);
