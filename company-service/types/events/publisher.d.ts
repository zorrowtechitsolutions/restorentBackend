export declare const connectRabbitMQ: () => Promise<void>;
export declare const publishEvent: (exchange: string, routingKey: string, data: any) => Promise<void>;
