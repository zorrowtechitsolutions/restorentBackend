import amqp from 'amqplib';
import { env } from '../config/env';
import { logger } from '../utils/logger';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    let connected = false;
    let attempts = 0;
    const maxAttempts = 5;

    while (!connected && attempts < maxAttempts) {
        try {
            const connection = await amqp.connect(env.RABBITMQ_URL);
            
            connection.on('error', (err) => {
                logger.error('❌ User Service RabbitMQ Connection Error:', { error: err.message });
            });

            connection.on('close', () => {
                logger.warn('⚠️ User Service RabbitMQ Connection closed. Retrying...');
                channel = null as any;
                setTimeout(connectRabbitMQ, 5000);
            });

            channel = await connection.createChannel();
            logger.info('🐰 User Service connected to RabbitMQ');
            connected = true;
        } catch (error: any) {
            attempts++;
            logger.error(`❌ RabbitMQ Connection attempt ${attempts} failed:`, { error: error.message });
            if (attempts < maxAttempts) {
                logger.info("Retrying in 5 seconds...");
                await new Promise((resolve) => setTimeout(resolve, 5000));
            } else {
                logger.error("Max RabbitMQ connection attempts reached.");
            }
        }
    }
};

export const publishEvent = async (exchange: string, routingKey: string, data: any) => {
    try {
        if (!channel) {
            await connectRabbitMQ();
        }
        await channel.assertExchange(exchange, 'direct', { durable: true });
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)), { persistent: true });
    } catch (error: any) {
        logger.error('❌ Event Publish Error:', { error: error.message });
    }
};
