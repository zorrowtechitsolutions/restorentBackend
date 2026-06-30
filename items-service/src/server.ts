import app from "./app";

import { connectDB } from "./config/db";
import { connectRabbitMQ } from "./events/publisher";
import { startConsumer } from "./events/consumer";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import sequelize from "./config/db";

// Import all models to ensure associations are registered before sync
import "./models/item-category.model";
import "./models/item-tax.model";
import "./models/item.model";
import "./models/item-attribute.model";
import "./models/item-variation.model";
import "./models/item-extra.model";
import "./models/item-addon.model";

const PORT = env.PORT;

// Database Connection and Server Startup
const startServer = async () => {
    try {
        await connectDB();
        await connectRabbitMQ();
        startConsumer(); // Fire and forget so it runs in background

        // Ensure ALL tables are in sync
        // --- REMOVED DUE TO MIGRATIONS MIGRATION ---
        // await sequelize.sync({ alter: true });

        // Starting Items Service
        const server = app.listen(PORT, () => {
            logger.info(`🚀 Items Service is running on port ${PORT}`);
        });

        // Graceful Shutdown Handler
        process.on("SIGTERM", async () => {
            logger.info("SIGTERM received. Shutting down gracefully...");
            server.close(() => {
                logger.info("HTTP server closed.");
            });
            process.exit(0);
        });
    } catch (error) {
        logger.error("❌ Failed to start server:", { error });
        process.exit(1);
    }
};

startServer();
