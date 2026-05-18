import express, { Request, Response, NextFunction } from "express";
import apiRoutes from "./routes";
import { migrate } from "./db/migrate";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(express.json());


app.use("/api", apiRoutes);

app.use(errorHandler);

async function bootstrap() {
    try {
        await migrate();  
        app.listen(3000, () => console.log("API TypeScript Version started on http://localhost:3000"));
    } catch (err) {
        console.error("Fatal startup error:", err);
        process.exit(1);
    }
}

bootstrap();