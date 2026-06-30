"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const company_service_1 = require("../services/company.service");
const router = express_1.default.Router();
// Proxy all company-related endpoints
router.use("/companies", company_service_1.proxyRequest);
router.use("/branches", company_service_1.proxyRequest);
router.use("/payment-gateway", company_service_1.proxyRequest);
router.use("/notification", company_service_1.proxyRequest);
router.use("/notification-alert", company_service_1.proxyRequest);
exports.default = router;
