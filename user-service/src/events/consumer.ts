import amqp from "amqplib";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const QUEUE_NAME = "user_service_queue";

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

      // Bind to permission_events exchange for ROLE_UPDATED
      await channel.assertExchange("permission_events", "direct", { durable: true });
      await channel.bindQueue(QUEUE_NAME, "permission_events", "ROLE_UPDATED");

      // Bind to branch_events exchange for BRANCH_UPDATED
      await channel.assertExchange("branch_events", "direct", { durable: true });
      await channel.bindQueue(QUEUE_NAME, "branch_events", "BRANCH_UPDATED");

      logger.info(`🐰 User Service Consumer listening on queue: ${QUEUE_NAME}`);

      channel.consume(QUEUE_NAME, async (msg) => {
        if (msg !== null) {
          try {
            const routingKey = msg.fields.routingKey;
            const data = JSON.parse(msg.content.toString());

            logger.info(`📥 Received event: ${routingKey}`, data);

            switch (routingKey) {
              case "ROLE_UPDATED":
                await handleRoleUpdated(data);
                break;
              case "BRANCH_UPDATED":
                await handleBranchUpdated(data);
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
        logger.error("❌ User Service RabbitMQ Consumer Error:", { error: err.message });
      });

      connection.on("close", () => {
        logger.warn("⚠️ User Service RabbitMQ Consumer closed. Retrying...");
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

const handleRoleUpdated = async (data: any) => {
  try {
    logger.info(`Processing ROLE_UPDATED event for role ${data.roleId}`);
    // Stub: Invalidate cached role permissions or refresh user sessions
    // Example: await redisClient.del(`role:${data.roleId}:permissions`);
  } catch (error: any) {
    logger.error("Error in handleRoleUpdated:", { error: error.message });
  }
};

const handleBranchUpdated = async (data: any) => {
  try {
    logger.info(`Processing BRANCH_UPDATED event for branch ${data.branchId}`);
    // Stub: Update cached branch details for users
    // Example: await redisClient.del(`branch:${data.branchId}`);
  } catch (error: any) {
    logger.error("Error in handleBranchUpdated:", { error: error.message });
  }
};
