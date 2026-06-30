import amqp from 'amqplib';
import dotenv from "dotenv";
dotenv.config();

let channel: amqp.Channel;

// We assume RABBITMQ_URL is in the environment
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

export const connectRabbitMQ = async () => {
    let connected = false;
    let attempts = 0;
    const maxAttempts = 5;

    while (!connected && attempts < maxAttempts) {
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            
            connection.on('error', (err) => {
                console.error('❌ HR Service RabbitMQ Connection Error:', { error: err.message });
            });

            connection.on('close', () => {
                console.warn('⚠️ HR Service RabbitMQ Connection closed. Retrying...');
                channel = null as any;
                setTimeout(connectRabbitMQ, 5000);
            });

            channel = await connection.createChannel();
            console.log('🐰 HR Service connected to RabbitMQ');
            connected = true;
        } catch (error: any) {
            attempts++;
            console.error(`❌ RabbitMQ Connection attempt ${attempts} failed:`, { error: error.message });
            if (attempts < maxAttempts) {
                console.log("Retrying in 5 seconds...");
                await new Promise((resolve) => setTimeout(resolve, 5000));
            } else {
                console.error("Max RabbitMQ connection attempts reached.");
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
        console.error('❌ Event Publish Error:', { error: error.message });
    }
};
