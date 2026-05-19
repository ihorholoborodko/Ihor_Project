import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import type { Database } from "sqlite";

const app = express();
app.use(express.json());

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    next();
});

const demoAuth = (req: any, res: any, next: NextFunction) => {
    const userId = req.header("X-Demo-UserId");
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    req.user = { id: userId };
    next();
};

let db: Database;

async function setupDb() {
    db = await open({ filename: "./lab5.db", driver: sqlite3.Database });
    await db.exec(`
        CREATE TABLE IF NOT EXISTS ads (
            id TEXT PRIMARY KEY,
            title TEXT, category TEXT, body TEXT, author TEXT,
            ownerUserId TEXT, createdAt TEXT
        )
    `);
}

app.get("/api/v1/ads", async (req: Request, res: Response) => {
    const search = req.query.search || "";
    const ads = await db.all('SELECT * FROM ads WHERE title LIKE ?', [`%${search}%`]);
    res.json(ads);
});

app.post("/api/v1/ads", demoAuth, async (req: any, res: any) => {
    const { title, category, body, author } = req.body;
    
    let errors: any = {};
    if (!title) errors.title = ["Заголовок є обов'язковим"];
    if (!category) errors.category = ["Оберіть категорію зі списку"];
    if (!body) errors.body = ["Текст оголошення не може бути порожнім"];

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ 
            error: "Validation error", 
            errors 
        });
    }

    const newAd = {
        id: Date.now().toString(),
        title, category, body, author: author || "Анонім",
        ownerUserId: req.user.id, // Зберігаємо ID власника
        createdAt: new Date().toLocaleString()
    };

    await db.run(
        'INSERT INTO ads (id, title, category, body, author, ownerUserId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [newAd.id, newAd.title, newAd.category, newAd.body, newAd.author, newAd.ownerUserId, newAd.createdAt]
    );
    res.status(201).json(newAd);
});


app.delete("/api/v1/ads/:id", demoAuth, async (req: any, res: any) => {
    const ad = await db.get('SELECT * FROM ads WHERE id = ?', [req.params.id]);
    
    if (!ad) return res.status(404).json({ error: "Not found" });
    if (ad.ownerUserId !== req.user.id) {
        return res.status(403).json({ error: "Forbidden: Це не ваше оголошення!" });
    }

    await db.run('DELETE FROM ads WHERE id = ?', [req.params.id]);
    res.status(204).send();
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const isDev = process.env.NODE_ENV !== "production";
    res.status(500).json({
        error: "Internal Server Error",
        details: isDev ? String(err.message) : undefined 
    });
});

setupDb().then(() => {
    app.listen(3000, () => console.log("Бекенд (TS+SQLite) запущено на порту 3000"));
});