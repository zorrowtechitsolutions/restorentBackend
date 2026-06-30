import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { createOrderSchema, updateOrderSchema } from "../validation/order.validation";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder
} from "../controllers/order.controller";

const router = Router();

router.post("/order", validate(createOrderSchema), createOrder);
router.get("/order", getOrders);
router.get("/order/:id", getOrder);
router.put("/order/:id", validate(updateOrderSchema), updateOrderStatus);
router.delete("/order/:id", deleteOrder);

export default router;
