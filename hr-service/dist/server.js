"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const publisher_1 = require("./events/publisher");
const consumer_1 = require("./events/consumer");
const PORT = process.env.PORT || 3004;
const startServer = async () => {
    try {
        await db_1.default.authenticate();
        console.log("✅ PostgreSQL Connected (HR Service)");
        await (0, publisher_1.connectRabbitMQ)();
        (0, consumer_1.startConsumer)(); // Fire and forget so it runs in background
        app_1.default.listen(PORT, () => {
            console.log(`🚀 HR Service running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Unable to connect to the database:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map