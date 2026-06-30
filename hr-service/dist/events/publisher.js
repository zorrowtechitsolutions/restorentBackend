"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishEvent = exports.connectRabbitMQ = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let channel;
// We assume RABBITMQ_URL is in the environment
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const connectRabbitMQ = async () => {
    let connected = false;
    let attempts = 0;
    const maxAttempts = 5;
    while (!connected && attempts < maxAttempts) {
        try {
            const connection = await amqplib_1.default.connect(RABBITMQ_URL);
            connection.on('error', (err) => {
                console.error('❌ HR Service RabbitMQ Connection Error:', { error: err.message });
            });
            connection.on('close', () => {
                console.warn('⚠️ HR Service RabbitMQ Connection closed. Retrying...');
                channel = null;
                setTimeout(exports.connectRabbitMQ, 5000);
            });
            channel = await connection.createChannel();
            console.log('🐰 HR Service connected to RabbitMQ');
            connected = true;
        }
        catch (error) {
            attempts++;
            console.error(`❌ RabbitMQ Connection attempt ${attempts} failed:`, { error: error.message });
            if (attempts < maxAttempts) {
                console.log("Retrying in 5 seconds...");
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            else {
                console.error("Max RabbitMQ connection attempts reached.");
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
        console.error('❌ Event Publish Error:', { error: error.message });
    }
};
exports.publishEvent = publishEvent;
//# sourceMappingURL=publisher.js.map