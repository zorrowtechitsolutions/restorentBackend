"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hr_service_1 = require("../services/hr.service");
const router = express_1.default.Router();
// Proxy all HR-related endpoints
router.use("/hr", hr_service_1.proxyRequest);
router.use("/employees", hr_service_1.proxyRequest);
router.use("/attendance", hr_service_1.proxyRequest);
router.use("/payroll", hr_service_1.proxyRequest);
router.use("/leave", hr_service_1.proxyRequest);
exports.default = router;
