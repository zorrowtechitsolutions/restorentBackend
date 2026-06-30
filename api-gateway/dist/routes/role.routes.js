"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const role_service_1 = require("../services/role.service");
const router = express_1.default.Router();
// Proxy all role-related endpoints
router.use("/roles", role_service_1.proxyRequest);
router.use("/permissions", role_service_1.proxyRequest);
exports.default = router;
