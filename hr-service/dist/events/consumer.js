"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startConsumer = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE_NAME = "hr_service_queue";
const startConsumer = async () => {
    let connected = false;
    let attempts = 0;
    const maxAttempts = 5;
    while (!connected && attempts < maxAttempts) {
        try {
            const connection = await amqplib_1.default.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();
            // Ensure the queue exists
            await channel.assertQueue(QUEUE_NAME, { durable: true });
            // Bind the queue to the user_events exchange for specific routing keys
            await channel.assertExchange("user_events", "direct", { durable: true });
            await channel.bindQueue(QUEUE_NAME, "user_events", "USER_REGISTERED");
            console.log(`🐰 HR Service Consumer listening on queue: ${QUEUE_NAME}`);
            channel.consume(QUEUE_NAME, async (msg) => {
                if (msg !== null) {
                    try {
                        const routingKey = msg.fields.routingKey;
                        const data = JSON.parse(msg.content.toString());
                        console.log(`📥 Received event: ${routingKey}`, data);
                        switch (routingKey) {
                            case "USER_REGISTERED":
                                await handleUserRegistered(data);
                                break;
                            default:
                                console.warn(`Unhandled routing key: ${routingKey}`);
                        }
                        channel.ack(msg);
                    }
                    catch (error) {
                        console.error(`❌ Error processing message: ${error.message}`);
                        channel.ack(msg); // Acking to avoid infinite loop for now
                    }
                }
            });
            connection.on("error", (err) => {
                console.error("❌ HR Service RabbitMQ Consumer Error:", { error: err.message });
            });
            connection.on("close", () => {
                console.warn("⚠️ HR Service RabbitMQ Consumer closed. Retrying...");
                setTimeout(exports.startConsumer, 5000);
            });
            connected = true;
        }
        catch (error) {
            attempts++;
            console.error(`❌ RabbitMQ Consumer Connection attempt ${attempts} failed:`, { error: error.message });
            if (attempts < maxAttempts) {
                console.log("Retrying consumer connection in 5 seconds...");
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            else {
                console.error("Max RabbitMQ consumer connection attempts reached.");
            }
        }
    }
};
exports.startConsumer = startConsumer;
// --- Handlers ---
const handleUserRegistered = async (data) => {
    try {
        // Note: HR service may want to create an Employee profile based on role
        // For now, we stub this out. You would check data.roleId against STAFF roles.
        console.log(`Processing USER_REGISTERED event for user ${data.userId}`);
        // Example logic (if User model exists in HR service to cache users)
        // await User.create({ id: data.userId, branch_id: data.branchId, role_id: data.roleId });
        // console.log(`Cached user ${data.userId} in HR service`);
    }
    catch (error) {
        console.error("Error in handleUserRegistered:", { error: error.message });
    }
};
//# sourceMappingURL=consumer.js.map