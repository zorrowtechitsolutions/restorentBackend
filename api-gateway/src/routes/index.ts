import express from "express";
import userRoutes from "./user.routes";
import companyRoutes from "./company.routes";
import itemsRoutes from "./items.routes";
import roleRoutes from "./role.routes";
import hrRoutes from "./hr.routes";

const router = express.Router();

router.use("/", userRoutes);
router.use("/", companyRoutes);
router.use("/", itemsRoutes);
router.use("/", roleRoutes);
router.use("/", hrRoutes);

export default router;
