import amqp from "amqplib";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import Item from "../models/item.model";

const QUEUE_NAME = "items_service_queue";

export const startConsumer = async () => {
  let connected = false;
  let attempts = 0;
  const maxAttempts = 5;

  while (!connected && attempts < maxAttempts) {
    try {
      const connection = await amqp.connect(env.RABBITMQ_URL);
      const channel = await connection.createChannel();

      // Ensure the queue exists
      await channel.assertQueue(QUEUE_NAME, { durable: true });

      // Bind the queue to the branch_events exchange for specific routing keys
      await channel.assertExchange("branch_events", "direct", { durable: true });
      await channel.bindQueue(QUEUE_NAME, "branch_events", "BRANCH_DELETED");

      logger.info(`🐰 Items Service Consumer listening on queue: ${QUEUE_NAME}`);

      channel.consume(QUEUE_NAME, async (msg) => {
        if (msg !== null) {
          try {
            const routingKey = msg.fields.routingKey;
            const data = JSON.parse(msg.content.toString());

            logger.info(`📥 Received event: ${routingKey}`, data);

            switch (routingKey) {
              case "BRANCH_DELETED":
                await handleBranchDeleted(data);
                break;
              default:
                logger.warn(`Unhandled routing key: ${routingKey}`);
            }

            channel.ack(msg);
          } catch (error: any) {
            logger.error(`❌ Error processing message: ${error.message}`);
            channel.ack(msg);
          }
        }
      });

      connection.on("error", (err) => {
        logger.error("❌ Items Service RabbitMQ Consumer Error:", { error: err.message });
      });

      connection.on("close", () => {
        logger.warn("⚠️ Items Service RabbitMQ Consumer closed. Retrying...");
        setTimeout(startConsumer, 5000);
      });

      connected = true;
    } catch (error: any) {
      attempts++;
      logger.error(`❌ RabbitMQ Consumer Connection attempt ${attempts} failed:`, { error: error.message });
      if (attempts < maxAttempts) {
        logger.info("Retrying consumer connection in 5 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        logger.error("Max RabbitMQ consumer connection attempts reached.");
      }
    }
  }
};

// --- Handlers ---

const handleBranchDeleted = async (data: any) => {
  try {
    logger.info(`Processing BRANCH_DELETED event for branch ${data.branchId}`);

    // Stub: Mark items as unavailable for the deleted branch
    // Customize this based on your schema — e.g., if items have a branch_id column
    // await Item.update({ status: 0 }, { where: { branch_id: data.branchId } });
    // logger.info(`Marked items unavailable for branch ${data.branchId}`);
  } catch (error: any) {
    logger.error("Error in handleBranchDeleted:", { error: error.message });
  }
};
