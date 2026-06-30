"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error("Server error", {
        requestId: req.id,
        message: err.message,
        stack: err.stack,
    });
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error in API Gateway",
        error: process.env.NODE_ENV === "development" ? err : {},
    });
};
exports.errorHandler = errorHandler;
