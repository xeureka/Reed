import express from "express";
import cors from "cors";
import api from "./routes/api.routes";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
dotenv.config();

const app = express();

const corsOptions = {
    origin: (
        process.env.CORS_ORIGINS ??
        "http://localhost:5174,http://localhost:5173"
    )
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api", api);

app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use(
    (
        error: Error & { status?: number },
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
    ) => {
        console.error("Unhandled API error:", error);
        res.status(error.status ?? 500).json({
            error: "Internal server error",
        });
    },
);

const PORT = Number(process.env.PORT ?? 3001);
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
});
