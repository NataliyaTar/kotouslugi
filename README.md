# kotouslugi

## Архитектура

| Слой | Технология | Порт | Контейнер |
|------|-----------|------|-----------|
| Фронт | Angular 17 + nginx | `36847` | `kotouslugi-frontend` |
| Бэк | Spring Boot 3, Java 17 | `8080` | `kotouslugi-backend` |
| БД | PostgreSQL 16 | `5432` | `kotouslugi-postgres` |

**Реализованные услуги:**
- Единый реестр паспортов животных (`animal_passport`)
- Запись к грумеру (`grooming_booking`)
- Отзыв о посещении грумера (`grooming_review`)

## Контроллеры API

| Endpoint | Контроллер | Назначение |
|----------|-----------|------------|
| `/api/cat/*` | `CatController` | Коты-пользователи |
| `/api/service/*` | `ProductServiceController` | Список котоуслуг |
| `/api/banner/*` | `BannerController` | Баннеры на главной |
| `/api/requisition/*` | `RequisitionController` | Заявки на услуги |
| `/api/passport/*` | `PassportController` | Реестр паспортов |
| `/api/grooming/*` | `GroomingController` | Запись к грумеру, слоты, отзывы |

**Swagger:** http://localhost:8080/swagger-ui/index.html

## Запуск проекта (Docker)

```bash
docker compose up -d --build
```

| Что | Адрес |
|-----|-------|
| Сайт | http://localhost:36847 |
| API | http://localhost:8080 |
| БД | `localhost:5432`, user/pass: `kotouslugi` |

```bash
docker compose ps
docker compose down
docker compose down -v
```

## Подключение к БД

```bash
docker exec -it kotouslugi-postgres psql -U kotouslugi -d kotouslugi
```

Параметры для DBeaver/DataGrip/pgAdmin:
- Host: `localhost`
- Port: `5432`
- Database: `kotouslugi`
- User: `kotouslugi`
- Password: `kotouslugi`

## Тестовые данные

### Коты
- Феликс (`id=1`)
- Муся (`id=2`)
- Барсик (`id=3`)
- Лада (`id=4`)

### Груминг-салоны
- `Лапки-Ножницы` (`id=0`)
- `Котополис Grooming` (`id=1`)
- `Пушистый стиль` (`id=2`)

### Грумеры
- `Котова Анна Сергеевна` (`salonId=0`)
- `Мяукин Петр Игоревич` (`salonId=0`)
- `Барсикова Елена Викторовна` (`salonId=1`)
- `Лапина Дарья Олеговна` (`salonId=1`)

### Пример записи к грумеру
- Кот: `Феликс`
- Салон: `Лапки-Ножницы`
- Пакет: `Полный уход`
- Дата: `2026-07-10`
- Время: `11:00`
- Контакт: `79001234567`
- Грумер: `Котова Анна Сергеевна`

### Пример отзыва
- Оценка: `5`
- Комментарий: `Очень аккуратная стрижка, кот спокоен и доволен`

### Поиск в реестре паспортов
- по номеру паспорта (например `1`)
- по номеру чипа (например `985112000123456`)
