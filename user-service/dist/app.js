"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const user_role_routes_1 = __importDefault(require("./routes/user-role.routes"));
const dining_table_routes_1 = __importDefault(require("./routes/dining-table.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const logger_middleware_1 = require("./middleware/logger.middleware");
const logger_1 = require("./utils/logger");
// Models (Import to trigger initialization)
const user_model_1 = __importDefault(require("./models/user.model"));
const user_role_model_1 = __importDefault(require("./models/user-role.model"));
const dining_table_model_1 = __importDefault(require("./models/dining-table.model"));
const order_model_1 = __importDefault(require("./models/order.model"));
const order_item_model_1 = __importDefault(require("./models/order-item.model"));
const delivery_model_1 = __importDefault(require("./models/delivery.model"));
// Initialize Associations
user_model_1.default.associate();
user_role_model_1.default.associate();
dining_table_model_1.default.associate();
order_model_1.default.associate();
order_item_model_1.default.associate();
delivery_model_1.default.associate();
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, helmet_1.default)());
app.use(logger_middleware_1.requestLogger);
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://foodscan.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/", user_routes_1.default);
app.use("/", user_role_routes_1.default);
app.use("/", dining_table_routes_1.default);
app.use("/", order_routes_1.default);
// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        service: "user-service",
        timestamp: new Date().toISOString(),
    });
});
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ status: 404, message: "Resource not found" });
});
// Error Handler
app.use((err, req, res, next) => {
    logger_1.logger.error("Server error", { message: err.message, stack: err.stack });
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
        const messages = err.errors?.map((e) => e.message) ?? [err.message];
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
exports.default = app;
//# sourceMappingURL=app.js.map