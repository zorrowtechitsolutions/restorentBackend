import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import { env } from "./config/env";
import { requestLogger } from "./middleware/logger.middleware";
import dotenv from "dotenv";
dotenv.config();

const app = express();

/**
 * TRUST PROXY
 */
app.set("trust proxy", 1);

/**
 * SECURITY
 */
app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin",
        },
    })
);

/**
 * LOGGER
 */
app.use(requestLogger);

/**
 * BODY PARSER
 */
app.use(express.json({ limit: "10mb" }));

/**
 * GENERAL API LIMITER
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
        error: {
            code: "RATE_LIMIT_EXCEEDED",
            details: null,
        },
    },
});

/**
 * APPLY GENERAL LIMITER
 */
app.use("/api", limiter);

/**
 * PROFESSIONAL LOGIN LIMITER
 */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: any) => {
        const email = req.body?.email || req.body?.phone || "unknown";
        return `${req.ip}-${email}`;
    },
    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes.",
        error: {
            code: "LOGIN_RATE_LIMIT_EXCEEDED",
            details: null,
        },
    },
});

/**
 * LOGIN ROUTES
 */
app.use("/api/users/login", loginLimiter);

/**
 * CORS
 */
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
        ],
        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "PATCH",
            "OPTIONS",
        ],
        credentials: true,
        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);

/**
 * HEALTH CHECK
 */
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: "healthy",
        service: "api-gateway",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.NODE_ENV,
    });
});

/**
 * ROUTES
 */
app.use("/api", routes);

/**
 * ERROR HANDLER
 */
app.use(errorHandler);

export default app;
