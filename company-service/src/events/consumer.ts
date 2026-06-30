import amqp from "amqplib";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { handleBranchEvent } from "../handlers/branch.handler";
import { handleAttendanceEvent } from "../handlers/attendance.handler";
import { handleLeaveRequestEvent } from "../handlers/leave-request.handler";
import { handleOfficeShiftEvent } from "../handlers/office-shift.handler";
import { handlePaymentGatewayEvent } from "../handlers/payment-gateway.handler";
import { handleOfferEvent } from "../handlers/offer.handler";
import { handleOrderEvent } from "../handlers/order.handler";
import { handleUserEvent } from "../handlers/user.handler";

const QUEUE_NAME = "company_service_queue";

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

      // branch_events
      await channel.assertExchange("branch_events", "direct", { durable: true });
      await channel.bindQueue(QUEUE_NAME, "branch_events", "BRANCH_REGISTERED");
      await channel.bindQueue(QUEUE_NAME, "branch_events", "BRANCH_UPDATED");
      await channel.bindQueue(QUEUE_NAME, "branch_events", "BRANCH_DELETED");
      await channel.bindQueue(QUEUE_NAME, "branch_events", "BRANCH_RECOVERED");

      // hr_events
      await channel.assertExchange("hr_events", "direct", { durable: true });
      await channel.bindQueue(QUEUE_NAME, "hr_events", "ATTENDANCE_REGISTERED");
      await channel.bindQueue(QUEUE_NAME, "hr_events", "ATTENDANCE_UPDATED");
      await channel.bindQueue(QUEUE_NAME, "hr_events", "ATTENDANCE_DELETED");
      await channel.bindQueue(QUEUE_NAME, "hr_events", "LEAVE_REQUEST_CREATED");
      await channel.bindQueue(QUEUE_NAME, "hr_events", "LEAVE_REQUEST_UPDATED");
      await channel.bindQueue(QUEUE_NAME, "hr_events", "LEAVE_REQUEST_DELETED");
      await channel.bindQueue(QUEUE_NAME, "hr_events", "OFFICE_SHIFT_CREATED");
      await channel.bindQueue(QUEUE_NAME, "hr_events", "OFFICE_SHIFT_UPDATED");
      await channel.bindQueue(QUEUE_NAME, "hr_events", "OFFICE_SHIFT_DELETED");

      // company_events
      await channel.assertExchange("company_events", "direct", { durable: true });
      await channel.bindQueue(QUEUE_NAME, "company_events", "PAYMENT_GATEWAY_CREATED");
      await channel.bindQueue(QUEUE_NAME, "company_events", "PAYMENT_GATEWAY_UPDATED");
      await channel.bindQueue(QUEUE_NAME, "company_events", "PAYMENT_GATEWAY_DELETED");

      // item_events
      await channel.assertExchange("item_events", "direct", { durable: true });
      await channel.bindQueue(QUEUE_NAME, "item_events", "OFFER_CREATED");
      await channel.bindQueue(QUEUE_NAME, "item_events", "OFFER_UPDATED");
      await channel.bindQueue(QUEUE_NAME, "item_events", "OFFER_DELETED");

      // user_events
      await channel.assertExchange("user_events", "direct", { durable: true });
      await channel.bindQueue(QUEUE_NAME, "user_events", "ORDER_CREATED");
      await channel.bindQueue(QUEUE_NAME, "user_events", "ORDER_STATUS_UPDATED");
      await channel.bindQueue(QUEUE_NAME, "user_events", "ORDER_DELETED");
      await channel.bindQueue(QUEUE_NAME, "user_events", "USER_REGISTERED");
      await channel.bindQueue(QUEUE_NAME, "user_events", "USER_UPDATED");
      await channel.bindQueue(QUEUE_NAME, "user_events", "USER_DELETED");

      logger.info(`🐰 Company Service Consumer listening on queue: ${QUEUE_NAME}`);

      channel.consume(QUEUE_NAME, async (msg) => {
        if (msg !== null) {
          try {
            const routingKey = msg.fields.routingKey;
            const data = JSON.parse(msg.content.toString());

            logger.info(`📥 Received event: ${routingKey}`, data);

            if (routingKey.startsWith("BRANCH_")) {
              await handleBranchEvent(routingKey, data);
            } else if (routingKey.startsWith("ATTENDANCE_")) {
              await handleAttendanceEvent(routingKey, data);
            } else if (routingKey.startsWith("LEAVE_REQUEST_")) {
              await handleLeaveRequestEvent(routingKey, data);
            } else if (routingKey.startsWith("OFFICE_SHIFT_")) {
              await handleOfficeShiftEvent(routingKey, data);
            } else if (routingKey.startsWith("PAYMENT_GATEWAY_")) {
              await handlePaymentGatewayEvent(routingKey, data);
            } else if (routingKey.startsWith("OFFER_")) {
              await handleOfferEvent(routingKey, data);
            } else if (routingKey.startsWith("ORDER_")) {
              await handleOrderEvent(routingKey, data);
            } else if (routingKey.startsWith("USER_")) {
              await handleUserEvent(routingKey, data);
            } else {
              logger.warn(`Unhandled routing key: ${routingKey}`);
            }

            channel.ack(msg);
          } catch (error: any) {
            logger.error(`❌ Error processing message: ${error.message}`);
            channel.ack(msg); // Acking to avoid infinite loop for now
          }
        }
      });

      connection.on("error", (err) => {
        logger.error("❌ Company Service RabbitMQ Consumer Error:", { error: err.message });
      });

      connection.on("close", () => {
        logger.warn("⚠️ Company Service RabbitMQ Consumer closed. Retrying...");
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

