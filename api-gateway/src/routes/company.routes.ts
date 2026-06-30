import express from "express";
import { proxyRequest } from "../services/company.service";

const router = express.Router();

// Proxy all company-related endpoints
router.use("/branch", proxyRequest);
router.use("/payment-gateway", proxyRequest);
router.use("/notification", proxyRequest);
router.use("/notification-alert", proxyRequest);

export default router;
