"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const office_shift_routes_1 = __importDefault(require("./routes/office-shift.routes"));
const attendance_routes_1 = __importDefault(require("./routes/attendance.routes"));
const leave_type_routes_1 = __importDefault(require("./routes/leave-type.routes"));
const leave_request_routes_1 = __importDefault(require("./routes/leave-request.routes"));
const holiday_routes_1 = __importDefault(require("./routes/holiday.routes"));
const payroll_routes_1 = __importDefault(require("./routes/payroll.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://foodscan.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api", office_shift_routes_1.default);
app.use("/api", attendance_routes_1.default);
app.use("/api", leave_type_routes_1.default);
app.use("/api", leave_request_routes_1.default);
app.use("/api", holiday_routes_1.default);
app.use("/api", payroll_routes_1.default);
// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        service: "hr-service",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    });
});
// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ status: 404, message: "Resource not found" });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error in HR Service",
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map