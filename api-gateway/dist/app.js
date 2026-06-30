"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const env_1 = require("./config/env");
const logger_middleware_1 = require("./middleware/logger.middleware");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
/**
 * TRUST PROXY
 */
app.set("trust proxy", 1);
/**
 * SECURITY
 */
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: {
        policy: "cross-origin",
    },
}));
/**
 * LOGGER
 */
app.use(logger_middleware_1.requestLogger);
/**
 * BODY PARSER
 */
app.use(express_1.default.json({ limit: "10mb" }));
/**
 * GENERAL API LIMITER
 */
const limiter = (0, express_rate_limit_1.default)({
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
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
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
app.use((0, cors_1.default)({
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
}));
/**
 * HEALTH CHECK
 */
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        service: "api-gateway",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env_1.env.NODE_ENV,
    });
});
/**
 * ROUTES
 */
app.use("/api", routes_1.default);
/**
 * ERROR HANDLER
 */
app.use(error_middleware_1.errorHandler);
exports.default = app;
