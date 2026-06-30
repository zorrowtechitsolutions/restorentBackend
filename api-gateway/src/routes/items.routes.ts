import express from "express";
import { proxyRequest } from "../services/items.service";

const router = express.Router();

// Proxy all items-related endpoints
router.use("/item", proxyRequest);
router.use("/offers", proxyRequest);
router.use("/offer-items", proxyRequest);
router.use("/item-category", proxyRequest);
router.use("/item-tax", proxyRequest);
router.use("/item-attribute", proxyRequest);
router.use("/item-variation", proxyRequest);
router.use("/item-extra", proxyRequest);
router.use("/item-addon", proxyRequest);

export default router;
