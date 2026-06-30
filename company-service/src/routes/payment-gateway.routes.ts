import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createPaymentGatewaySchema,
  updatePaymentGatewaySchema,
} from "../validation/payment-gateway.validation";
import {
  createPaymentGateway,
  getAllPaymentGateways,
  getPaymentGateway,
  updatePaymentGateway,
  deletePaymentGateway,
} from "../controllers/payment-gateway.controller";

const router = Router();

router.post("/payment-gateway", validate(createPaymentGatewaySchema), createPaymentGateway);
router.get("/payment-gateway", getAllPaymentGateways);
router.get("/payment-gateway/:id", getPaymentGateway);
router.put("/payment-gateway/:id", validate(updatePaymentGatewaySchema), updatePaymentGateway);
router.delete("/payment-gateway/:id", deletePaymentGateway);

export default router;
