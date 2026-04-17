const express = require("express");
const apiRoutes = require("./routes");
const { ApiError } = require("./utils");
const { initDb } = require("./db/initDb");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const ms = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    });
    next();
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API! Use /api/users, /api/posts, or /api/comments" });
});

app.use("/api", apiRoutes);

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            error: { code: err.code, message: err.message, details: err.details }
        });
    }

    const msg = String(err && err.message ? err.message : err);
    if (msg.includes("UNIQUE constraint failed")) {
        return res.status(409).json({ error: { code: "CONFLICT", message: "Unique constraint violation" } });
    }
    if (msg.includes("NOT NULL constraint failed")) {
        return res.status(400).json({ error: { code: "BAD_REQUEST", message: "Invalid data format for DB" } });
    }

    console.error("Unhandled error:", err);
    return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});

async function bootstrap() {
    try {
        
        await initDb();
        app.listen(3000, () => console.log("API Layered Version with SQLite started on http://localhost:3000"));
    } catch (err) {
        console.error("Fatal startup error:", err);
        process.exit(1);
    }
}

bootstrap();