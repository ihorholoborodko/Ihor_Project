const express = require("express");
const app = express();

app.use(express.json());

// 1. Middleware логування запитів
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const ms = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    });
    next();
});

// Клас для централізованої обробки помилок
class ApiError extends Error {
    constructor(status, code, message, details = null) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

// === НАШІ ДАНІ В ОПЕРАТИВНІЙ ПАМ'ЯТІ ===
let users = [];
let posts = [];
let userIdCounter = 1;
let postIdCounter = 1;

// === ФУНКЦІЇ ВАЛІДАЦІЇ ===
function requireString(value, fieldName, minLen = 1) {
    if (typeof value !== "string" || value.trim().length < minLen) {
        return { field: fieldName, message: `${fieldName} is required and must be at least ${minLen} characters` };
    }
    return null;
}

// ==========================================
// МАРШРУТИ ДЛЯ USERS
// ==========================================

// Отримати список користувачів
app.get("/api/users", (req, res) => {
    res.status(200).json({ items: users });
});

// Отримати користувача за ID
app.get("/api/users/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) throw new ApiError(404, "NOT_FOUND", "User not found");
    res.status(200).json(user);
});

// Створити користувача
app.post("/api/users", (req, res) => {
    const dto = req.body;
    const errors = [];
    
    const e1 = requireString(dto.name, "name", 2);
    if (e1) errors.push(e1);
    const e2 = requireString(dto.email, "email", 5);
    if (e2) errors.push(e2);

    if (errors.length > 0) {
        throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }

    const newUser = { id: userIdCounter++, name: dto.name, email: dto.email };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Оновити користувача
app.put("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) throw new ApiError(404, "NOT_FOUND", "User not found");

    const dto = req.body;
    const errors = [];
    const e1 = requireString(dto.name, "name", 2);
    if (e1) errors.push(e1);
    const e2 = requireString(dto.email, "email", 5);
    if (e2) errors.push(e2);

    if (errors.length > 0) {
        throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }

    users[userIndex] = { id, name: dto.name, email: dto.email };
    res.status(200).json(users[userIndex]);
});

// Видалити користувача
app.delete("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) throw new ApiError(404, "NOT_FOUND", "User not found");

    users.splice(userIndex, 1);
    res.status(204).send();
});

// ==========================================
// МАРШРУТИ ДЛЯ POSTS (Дошка оголошень)
// ==========================================

// Отримати список постів
app.get("/api/posts", (req, res) => {
    res.status(200).json({ items: posts });
});

// Отримати пост за ID
app.get("/api/posts/:id", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) throw new ApiError(404, "NOT_FOUND", "Post not found");
    res.status(200).json(post);
});

// Створити пост
app.post("/api/posts", (req, res) => {
    const dto = req.body;
    const errors = [];
    
    const e1 = requireString(dto.title, "title", 3);
    if (e1) errors.push(e1);
    const e2 = requireString(dto.category, "category", 2);
    if (e2) errors.push(e2);
    const e3 = requireString(dto.body, "body", 5);
    if (e3) errors.push(e3);
    const e4 = requireString(dto.author, "author", 2);
    if (e4) errors.push(e4);

    if (errors.length > 0) {
        throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }

    const newPost = { 
        id: postIdCounter++, 
        title: dto.title, 
        category: dto.category,
        body: dto.body,
        author: dto.author,
        createdAt: new Date().toISOString() // Автоматично генеруємо дату
    };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// Оновити пост
app.put("/api/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) throw new ApiError(404, "NOT_FOUND", "Post not found");

    const dto = req.body;
    const errors = [];
    const e1 = requireString(dto.title, "title", 3);
    if (e1) errors.push(e1);
    const e2 = requireString(dto.category, "category", 2);
    if (e2) errors.push(e2);
    const e3 = requireString(dto.body, "body", 5);
    if (e3) errors.push(e3);
    const e4 = requireString(dto.author, "author", 2);
    if (e4) errors.push(e4);

    if (errors.length > 0) {
        throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
    }

    // Оновлюємо, але зберігаємо оригінальний createdAt
    posts[postIndex] = { 
        id, 
        title: dto.title, 
        category: dto.category,
        body: dto.body,
        author: dto.author,
        createdAt: posts[postIndex].createdAt 
    };
    res.status(200).json(posts[postIndex]);
});

// Видалити пост
app.delete("/api/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) throw new ApiError(404, "NOT_FOUND", "Post not found");

    posts.splice(postIndex, 1);
    res.status(204).send();
});


// ==========================================
// 2. Error Handler (Централізована обробка помилок)
// МАЄ БУТИ В КІНЦІ ПІСЛЯ ВСІХ МАРШРУТІВ
// ==========================================
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            error: { code: err.code, message: err.message, details: err.details }
        });
    }
    console.error("Unhandled error:", err);
    return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});

// Запуск сервера
app.listen(3000, () => console.log("API started on http://localhost:3000"));