"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../middleware/validate.middleware");
const order_validation_1 = require("../validation/order.validation");
const order_controller_1 = require("../controllers/order.controller");
const router = (0, express_1.Router)();
router.post("/order", (0, validate_middleware_1.validate)(order_validation_1.createOrderSchema), order_controller_1.createOrder);
router.get("/order", order_controller_1.getOrders);
router.get("/order/:id", order_controller_1.getOrder);
router.put("/order/:id", (0, validate_middleware_1.validate)(order_validation_1.updateOrderSchema), order_controller_1.updateOrderStatus);
router.delete("/order/:id", order_controller_1.deleteOrder);
exports.default = router;
//# sourceMappingURL=order.routes.js.map