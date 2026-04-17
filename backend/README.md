Лабораторна робота №3. Бекенд з SQLite
Варіант 4: Дошка оголошень групи

1. Як запустити проєкт
Для запуску сервера виконайте наступні кроки у терміналі:

Встановіть необхідні залежності (зокрема драйвер sqlite3):

Bash
npm install
Запустіть сервер у режимі розробки:

Bash
npm run dev
Сервер запуститься і буде доступний за адресою: http://localhost:3000.

Важливо: Файл бази даних app.db створюється автоматично при першому запуску у папці ./data/. Згідно з вимогами, ця папка та файл не додаються до репозиторію (додані в .gitignore).

2. Схема бази даних (реляційна модель)
Дані зберігаються в SQLite. Реалізовано 3 таблиці зі зв'язками:

Users (Користувачі):

id (INTEGER, PRIMARY KEY) — унікальний ідентифікатор.

name (TEXT, NOT NULL) — ім'я.

email (TEXT, NOT NULL, UNIQUE) — пошта (обмеження унікальності).

Posts (Оголошення):

id (INTEGER, PRIMARY KEY) — унікальний ідентифікатор.

userId (INTEGER, FOREIGN KEY) — посилання на автора (Users.id).

title (TEXT, NOT NULL) — заголовок.

category (TEXT, NOT NULL) — категорія.

body (TEXT, NOT NULL) — текст оголошення.

createdAt (TEXT, NOT NULL) — дата створення (ISO формат).

Зв'язок: ON DELETE CASCADE (при видаленні користувача видаляються його пости).

Comments (Коментарі):

id (INTEGER, PRIMARY KEY).

postId (INTEGER, FOREIGN KEY) — посилання на пост (Posts.id).

text (TEXT, NOT NULL).

author (TEXT, NOT NULL).

createdAt (TEXT, NOT NULL).

Зв'язок: ON DELETE CASCADE.

3. Приклади використання запитів (curl)
Робота з користувачами (Users)
Створити нового користувача:

Bash
curl -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"name\":\"Ігор\",\"email\":\"igor@example.com\"}"
Отримати всіх користувачів:

Bash
curl -i http://localhost:3000/api/users
Робота з постами (Posts)
Створити пост (успішна валідація, зв'язок з userId=1):

Bash
curl -i -X POST http://localhost:3000/api/posts -H "Content-Type: application/json" -d "{\"userId\":1,\"title\":\"Шукаю конспекти\",\"category\":\"Навчання\",\"body\":\"Хто може поділитися лекціями з математики?\"}"
Отримати список постів з фільтрацією, сортуванням та лімітом (вимога WHERE+ORDER+LIMIT):

Bash
curl -i "http://localhost:3000/api/posts?category=Навчання"
Робота з помилками
Спроба створити користувача з уже існуючим email (поверне 409 Conflict):

Bash
curl -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"name\":\"Дублікат\",\"email\":\"igor@example.com\"}"
Отримання неіснуючого ресурсу (поверне 404 Not Found):

Bash
curl -i http://localhost:3000/api/posts/999