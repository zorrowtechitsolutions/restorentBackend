import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { connectRabbitMQ } from "./events/publisher";
import { startConsumer } from "./events/consumer";

const PORT = env.PORT || 3003;

const startServer = async () => {
  try {
    await connectDB();
    await connectRabbitMQ();
    startConsumer(); // Fire and forget so it runs in background

    app.listen(PORT, () => {
      logger.info(`🚀 Company Service is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", { error });
    process.exit(1);
  }
};

startServer();

