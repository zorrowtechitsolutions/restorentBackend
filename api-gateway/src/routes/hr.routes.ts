import express from "express";
import { proxyRequest } from "../services/hr.service";

const router = express.Router();

// Proxy all HR-related endpoints
router.use("/holidays", proxyRequest);
router.use("/leave-requests", proxyRequest);
router.use("/leave-types", proxyRequest);
router.use("/attendances", proxyRequest);
router.use("/payrolls", proxyRequest);
router.use("/office-shifts", proxyRequest);

export default router;
