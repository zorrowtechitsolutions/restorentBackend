import app from "./app";
import sequelize from "./config/db";
import { connectRabbitMQ } from "./events/publisher";
import { startConsumer } from "./events/consumer";

const PORT = process.env.PORT || 3004;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connected (HR Service)");
    await connectRabbitMQ();
    startConsumer(); // Fire and forget so it runs in background

    app.listen(PORT, () => {
      console.log(`🚀 HR Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
