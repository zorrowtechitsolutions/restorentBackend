import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes";
import userRoleRoutes from "./routes/user-role.routes";
import diningTableRoutes from "./routes/dining-table.routes";
import orderRoutes from "./routes/order.routes";
import { requestLogger } from "./middleware/logger.middleware";
import { logger } from "./utils/logger";
import { env } from "./config/env";

// Models (Import to trigger initialization)
import User from "./models/user.model";
import UserRole from "./models/user-role.model";
import DiningTable from "./models/dining-table.model";
import Order from "./models/order.model";
import OrderItem from "./models/order-item.model";
import Delivery from "./models/delivery.model";

// Initialize Associations
User.associate();
UserRole.associate();
DiningTable.associate();
Order.associate();
OrderItem.associate();
Delivery.associate();

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(requestLogger);

app.use(
    cors({
        origin: ["http://localhost:5173", "https://foodscan.app"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Routes
app.use("/", userRoutes);
app.use("/", userRoleRoutes);
app.use("/", diningTableRoutes);
app.use("/", orderRoutes);

// Health Check
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: "healthy",
        service: "user-service",
        timestamp: new Date().toISOString(),
    });
});

// 404 Handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ status: 404, message: "Resource not found" });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error("Server error", { message: err.message, stack: err.stack });

    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
        const messages = err.errors?.map((e: any) => e.message) ?? [err.message];
        return res.status(400).json({
            success: false,
            message: messages.join(", "),
            error: { code: "VALIDATION_ERROR", details: messages },
        });
    }

    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      error: { code: err.code || "INTERNAL_SERVER_ERROR" },
    });
});

export default app;
