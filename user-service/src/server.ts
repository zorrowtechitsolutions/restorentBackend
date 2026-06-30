import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { connectRabbitMQ } from "./events/publisher";
import { startConsumer } from "./events/consumer";

const PORT = env.PORT;

const startServer = async () => {
    try {
        await connectDB();
        await connectRabbitMQ();
        startConsumer(); // Fire and forget so it runs in background

        const server = app.listen(PORT, () => {
            logger.info(`🚀 User Service running on port ${PORT}`);
        });

        // Graceful Shutdown
        process.on("SIGTERM", () => {
            logger.info("SIGTERM received. Shutting down...");
            server.close(() => process.exit(0));
        });
    } catch (error) {
        logger.error("❌ Failed to start server:", { error });
        process.exit(1);
    }
};

startServer();
