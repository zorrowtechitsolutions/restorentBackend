"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const publisher_1 = require("./events/publisher");
const consumer_1 = require("./events/consumer");
const PORT = env_1.env.PORT;
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        await (0, publisher_1.connectRabbitMQ)();
        (0, consumer_1.startConsumer)(); // Fire and forget so it runs in background
        const server = app_1.default.listen(PORT, () => {
            logger_1.logger.info(`🚀 User Service running on port ${PORT}`);
        });
        // Graceful Shutdown
        process.on("SIGTERM", () => {
            logger_1.logger.info("SIGTERM received. Shutting down...");
            server.close(() => process.exit(0));
        });
    }
    catch (error) {
        logger_1.logger.error("❌ Failed to start server:", { error });
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map