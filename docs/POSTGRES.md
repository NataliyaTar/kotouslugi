# PostgreSQL и Docker

## Всё в контейнерах (рекомендуется)

Из корня проекта:

```bash
docker compose up -d --build
```

| Сервис | URL |
|--------|-----|
| Сайт | http://localhost:36847 |
| API / Swagger | http://localhost:8080/swagger-ui/index.html |
| PostgreSQL | `localhost:5432` (user/pass: `kotouslugi`) |

Остановить: `docker compose down`  
Сбросить БД: `docker compose down -v` → `docker compose up -d --build`

---

## Только база (разработка без Docker для бэка/фронта)

Проект по умолчанию работает с **PostgreSQL** (профиль `postgres`). H2 остался только как опциональный профиль для локальной отладки без Docker.

### 1. Поднять базу

```bash
docker compose up -d
```

Проверка:
```bash
docker compose ps
```

### 2. Запустить бэкенд

```bash
# из корня репозитория
mvn install -DskipTests
cd kotouslugi-api
mvn spring-boot:run
```

Профиль `postgres` активируется автоматически (`application.properties`).

### 3. Подключение к БД

| Параметр | Значение |
|----------|----------|
| Host | `localhost` |
| Port | `5432` |
| Database | `kotouslugi` |
| User | `kotouslugi` |
| Password | `kotouslugi` |
| JDBC URL | `jdbc:postgresql://localhost:5432/kotouslugi` |

Клиенты: **DBeaver**, **pgAdmin**, `psql`:

```bash
docker exec -it kotouslugi-postgres psql -U kotouslugi -d kotouslugi
```

## Профили Spring

| Профиль | БД | Когда использовать |
|---------|-----|-------------------|
| `postgres` (default) | PostgreSQL | Основная разработка и демо |
| `h2` | H2 in-memory | Без Docker, `-Dspring-boot.run.profiles=h2` |

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

## Структура конфигурации

```
kotouslugi-api/src/main/resources/
├── application.properties          # общие настройки + active=postgres
├── application-postgres.properties # PostgreSQL datasource
└── application-h2.properties       # fallback H2

kotouslugi-core/src/main/resources/
├── data-postgres.sql               # seed (идемпотентный, ON CONFLICT)
└── data-h2.sql                     # seed для H2
```

## Особенности

- **Данные сохраняются** между перезапусками бэкенда (volume `postgres_data`)
- Схема создаётся Hibernate (`ddl-auto=update`) из JPA-сущностей
- Seed-данные идемпотентны — повторный старт не падает на дубликатах
- После seed синхронизируются sequences (`cat_seq`, `service_seq`, …)

## Сброс базы

```bash
docker compose down -v   # удалит volume с данными
docker compose up -d     # чистая БД + seed при старте бэка
```

## Docker не запускается: «Virtualization support not detected»

Если Docker Desktop пишет, что **виртуализация не обнаружена**, контейнер с PostgreSQL не поднимется. Варианты:

### Вариант A — включить виртуализацию (рекомендуется для Docker)

1. **Перезагрузка → BIOS/UEFI** (обычно Del, F2 или F12 при старте)
2. Найти и **включить**:
   - Intel: `Intel Virtualization Technology` / `VT-x`
   - AMD: `SVM Mode` / `AMD-V`
3. В Windows (PowerShell **от администратора**):
   ```powershell
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   ```
4. **Перезагрузка** → снова открыть Docker Desktop

Проверка:
```powershell
systeminfo | findstr /i "Hyper-V Virtualization"
```

### Вариант B — PostgreSQL без Docker (если BIOS недоступен)

Установи PostgreSQL напрямую на Windows:

```powershell
winget install PostgreSQL.PostgreSQL.17
```

При установке задай пароль суперпользователя `postgres`, затем в **pgAdmin** или `psql`:

```sql
CREATE USER kotouslugi WITH PASSWORD 'kotouslugi';
CREATE DATABASE kotouslugi OWNER kotouslugi;
GRANT ALL PRIVILEGES ON DATABASE kotouslugi TO kotouslugi;
```

Бэкенд уже настроен на `localhost:5432` / `kotouslugi` / `kotouslugi` — после этого просто `mvn spring-boot:run`.

### Вариант C — временно H2 (без Postgres и Docker)

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

Данные в RAM, при перезапуске сбрасываются — только для быстрой проверки UI.


## Переменные окружения

Скопируй `.env.example` → `.env` и при необходимости переопредели:

```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/kotouslugi
SPRING_DATASOURCE_USERNAME=kotouslugi
SPRING_DATASOURCE_PASSWORD=kotouslugi
```

Spring Boot подхватит `SPRING_DATASOURCE_*` автоматически.
