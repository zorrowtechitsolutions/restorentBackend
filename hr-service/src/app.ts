import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import officeShiftRoutes from "./routes/office-shift.routes";
import attendanceRoutes from "./routes/attendance.routes";
import leaveTypeRoutes from "./routes/leave-type.routes";
import leaveRequestRoutes from "./routes/leave-request.routes";
import holidayRoutes from "./routes/holiday.routes";
import payrollRoutes from "./routes/payroll.routes";

dotenv.config();

const app = express();

app.set("trust proxy", 1);
app.use(helmet());

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
app.use("/", officeShiftRoutes);
app.use("/", attendanceRoutes);
app.use("/", leaveTypeRoutes);
app.use("/", leaveRequestRoutes);
app.use("/", holidayRoutes);
app.use("/", payrollRoutes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    service: "hr-service",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ status: 404, message: "Resource not found" });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error in HR Service",
  });
});

export default app;
