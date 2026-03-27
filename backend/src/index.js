const express = require("express");
const apiRoutes = require("./routes");
const { ApiError } = require("./utils");

const app = express();
app.use(express.json());

// Логування
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const ms = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    });
    next();
});

// Підключаємо всі маршрути з префіксом /api
app.use("/api", apiRoutes);

// Централізований Error Handler
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            error: { code: err.code, message: err.message, details: err.details }
        });
    }
    console.error("Unhandled error:", err);
    return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});

app.listen(3000, () => console.log("API Layered Version started on http://localhost:3000"));