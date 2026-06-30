"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const items_service_1 = require("../services/items.service");
const router = express_1.default.Router();
// Proxy all items-related endpoints
router.use("/items", items_service_1.proxyRequest);
router.use("/offers", items_service_1.proxyRequest);
router.use("/item-schema", items_service_1.proxyRequest);
exports.default = router;
