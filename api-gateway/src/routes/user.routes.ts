import express from "express";
import { proxyRequest } from "../services/user.service";

const router = express.Router();

// Proxy all user-related endpoints
router.use("/users", proxyRequest);
router.use("/dining-table", proxyRequest);
router.use("/order", proxyRequest);
router.use("/user-role", proxyRequest);


export default router;
