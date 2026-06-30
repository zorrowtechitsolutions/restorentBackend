"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("../utils/logger");
const requestLogger = (req, res, next) => {
    const requestId = req.headers["x-request-id"] || crypto_1.default.randomUUID();
    req.id = requestId;
    logger_1.logger.info("Incoming request", {
        requestId,
        method: req.method,
        url: req.originalUrl || req.url,
        ip: req.ip,
    });
    next();
};
exports.requestLogger = requestLogger;
