"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishEvent = exports.connectRabbitMQ = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
let channel;
const connectRabbitMQ = async () => {
    let connected = false;
    let attempts = 0;
    const maxAttempts = 5;
    while (!connected && attempts < maxAttempts) {
        try {
            const connection = await amqplib_1.default.connect(env_1.env.RABBITMQ_URL);
            connection.on('error', (err) => {
                logger_1.logger.error('❌ User Service RabbitMQ Connection Error:', { error: err.message });
            });
            connection.on('close', () => {
                logger_1.logger.warn('⚠️ User Service RabbitMQ Connection closed. Retrying...');
                channel = null;
                setTimeout(exports.connectRabbitMQ, 5000);
            });
            channel = await connection.createChannel();
            logger_1.logger.info('🐰 User Service connected to RabbitMQ');
            connected = true;
        }
        catch (error) {
            attempts++;
            logger_1.logger.error(`❌ RabbitMQ Connection attempt ${attempts} failed:`, { error: error.message });
            if (attempts < maxAttempts) {
                logger_1.logger.info("Retrying in 5 seconds...");
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            else {
                logger_1.logger.error("Max RabbitMQ connection attempts reached.");
            }
        }
    }
};
exports.connectRabbitMQ = connectRabbitMQ;
const publishEvent = async (exchange, routingKey, data) => {
    try {
        if (!channel) {
            await (0, exports.connectRabbitMQ)();
        }
        await channel.assertExchange(exchange, 'direct', { durable: true });
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)), { persistent: true });
    }
    catch (error) {
        logger_1.logger.error('❌ Event Publish Error:', { error: error.message });
    }
};
exports.publishEvent = publishEvent;
//# sourceMappingURL=publisher.js.map