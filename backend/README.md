UA
Лабораторна робота №2. Бекенд без БД
Варіант 4: Дошка оголошень групи

1. Як запустити проєкт
Для запуску сервера локально виконайте наступні кроки у терміналі:

1) Перейдіть у папку з бекендом:
    bash: 
    cd backend

2) Встановіть усі необхідні залежності:
    bash: 
    npm install

3) Запустіть сервер у режимі розробки:
    bash:
    npm run dev

Сервер запуститься і буде доступний за адресою: http://localhost:3000.

2. Реалізовані сутності
У проєкті реалізовано три сутності, дані яких зберігаються в оперативній пам'яті:

Users (обов'язкова сутність): користувачі системи.

Поля: id, name, email.

Posts (сутність за варіантом): оголошення/пости на дошці.

Поля: id, title, category, body, author, createdAt.

Comments (сутність за варіантом): коментарі до постів.

Поля: id, postId, text, author, createdAt.

3. Приклади використання запитів (curl):
ВАЖЛИВО! При роботі з VS Code на Windows ОБОВ'ЯЗКОВО додавайте .exe до команди (curl.exe), або виконуйте запити у стандартному Command Prompt (cmd).

-----------

Робота з Users:
Отримати список усіх користувачів:

Bash:
curl -i http://localhost:3000/api/users

-----------

Створити нового користувача:

Bash:
curl -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"name\":\"Ігор\",\"email\":\"igor@example.com\"}"

-----------

Робота з Posts:
Створити новий пост (Успішна валідація, поверне 201 Created):

Bash:
curl -i -X POST http://localhost:3000/api/posts -H "Content-Type: application/json" -d "{\"title\":\"Шукаю конспекти\",\"category\":\"Навчання\",\"body\":\"Хто може поділитися лекціями з вищої математики за минулий тиждень?\",\"author\":\"Ігор Голобородько\"}"

-----------

Створити новий пост з помилкою валідації (Поверне 400 Bad Request):

Bash:
curl -i -X POST http://localhost:3000/api/posts -H "Content-Type: application/json" -d "{\"title\":\"1\",\"category\":\"\",\"body\":\"Короткий тест\",\"author\":\"Ігор\"}"

-----------

Отримати список усіх постів:

Bash:
curl -i http://localhost:3000/api/posts

-----------

Оновити пост (наприклад, з ID 1):

Bash:
curl -i -X PUT http://localhost:3000/api/posts/1 -H "Content-Type: application/json" -d "{\"title\":\"Оновлений заголовок\",\"category\":\"Навчання\",\"body\":\"Оновлений текст оголошення\",\"author\":\"Ігор\"}"

-----------

Видалити пост (наприклад, з ID 1):

Bash
curl -i -X DELETE http://localhost:3000/api/posts/1

-----------

Робота з Comments:
Створити коментар до існуючого поста (наприклад, postId = 1):

Bash:
curl -i -X POST http://localhost:3000/api/comments -H "Content-Type: application/json" -d "{\"postId\":1,\"text\":\"Маю конспекти, скину в телеграм.\",\"author\":\"Ігор\"}"

-----------

Отримати коментарі лише для конкретного поста (Фільтрація):

Bash:
curl -i "http://localhost:3000/api/comments?postId=1"

EN
Laboratory work #2. Backend without a DB
Option 4: Group bulletin board

1. How to start the project
To start the server locally, follow these steps in the terminal:

1) Go to the backend folder:
bash:
cd backend

2) Install all necessary dependencies:
bash:
npm install

3) Start the server in development mode:
bash:
npm run dev

The server will start and be available at: http://localhost:3000.

2. Implemented entities
The project implements three entities whose data is stored in RAM:

Users (required entity): system users.

Fields: id, name, email.

Posts (optional entity): announcements/posts on the board.

Fields: id, title, category, body, author, createdAt.

Comments (entity by variant): comments on posts.

Fields: id, postId, text, author, createdAt.

3. Examples of using queries (curl):
IMPORTANT! When working with VS Code on Windows, MANDATORY add .exe to the command (curl.exe), or execute queries in the standard Command Prompt (cmd).

-----------

Working with Users:
Get a list of all users:

Bash:
curl -i http://localhost:3000/api/users

-------

Create a new user:

Bash:
curl -i -X ​​POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"name\":\"Igor\",\"email\":\"igor@example.com\"}"

-------

Working with Posts:
Create a new post (Successful validation, will return 201 Created):

Bash:
curl -i -X ​​POST http://localhost:3000/api/posts -H "Content-Type: application/json" -d "{\"title\":\"Looking for notes\",\"category\":\"Education\",\"body\":\"Who can share last week's higher mathematics lectures?\",\"author\":\"Igor Holoborodko\"}"

---------

Create a new post with a validation error (Returns 400 Bad Request):

Bash:
curl -i -X ​​POST http://localhost:3000/api/posts -H "Content-Type: application/json" -d "{\"title\":\"1\",\"category\":\"\",\"body\":\"Short test\",\"author\":\"Igor\"}"

-------

Get a list of all posts:

Bash:
curl -i http://localhost:3000/api/posts

-------

Update a post (e.g. with ID 1):

Bash:
curl -i -X ​​PUT http://localhost:3000/api/posts/1 -H "Content-Type: application/json" -d "{\"title\":\"Updated title\",\"category\":\"Training\",\"body\":\"Updated text announcement\",\"author\":\"Igor\"}"

---------

Delete a post (for example, with ID 1):

Bash
curl -i -X ​​DELETE http://localhost:3000/api/posts/1

-----------

Working with Comments:
Create a comment on an existing post (for example, postId = 1):

Bash:
curl -i -X ​​POST http://localhost:3000/api/comments -H "Content-Type: application/json" -d "{\"postId\":1,\"text\":\"I have notes, I'll upload them to Telegram.\",\"author\":\"Igor\"}"

-----------

Get comments only for a specific post (Filtering):

Bash:
curl -i "http://localhost:3000/api/comments?postId=1"