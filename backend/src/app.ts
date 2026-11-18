import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { query } from "./config/db";
import { errorHandler, notFound } from "./middleware/error";
import { authRouter } from "./modules/auth/auth.routes";
import { usersRouter } from "./modules/users/users.routes";

export const app = express();

app.disable("x-powered-by");

const allowedOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", async (_req, res) => {
  try {
    await query("SELECT 1");
    res.json({ success: true, data: { status: "ok", database: "up" } });
  } catch {
    res.status(503).json({
      success: false,
      error: { message: "Database unavailable." },
      data: { status: "degraded", database: "down" },
    });
  }
});

app.get("/", (_req, res) => {
  res.json({
    success: true,
    data: { name: "RepRise API", version: "1.0.0" },
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use(notFound);
app.use(errorHandler);
