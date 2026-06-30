"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_service_1 = require("../services/user.service");
const router = express_1.default.Router();
// Proxy all user-related endpoints
router.use("/users", user_service_1.proxyRequest);
router.use("/patients", user_service_1.proxyRequest);
router.use("/vitals", user_service_1.proxyRequest);
router.use("/prescription", user_service_1.proxyRequest);
router.use("/documents", user_service_1.proxyRequest);
router.use("/lab-results", user_service_1.proxyRequest);
router.use("/email-enquiry", user_service_1.proxyRequest);
exports.default = router;
