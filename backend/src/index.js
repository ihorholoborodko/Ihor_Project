const express = require("express");
const apiRoutes = require("./routes");
const { initDb } = require("./db/initDb");
const { errorHandler } = require("./middlewares/errorHandler");

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

app.use("/api", apiRoutes);


app.use(errorHandler);

async function bootstrap() {
    try {
        await initDb();
        app.listen(3000, () => console.log("API Layered Version started on http://localhost:3000"));
    } catch (err) {
        console.error("Fatal startup error:", err);
        process.exit(1);
    }
}

bootstrap();