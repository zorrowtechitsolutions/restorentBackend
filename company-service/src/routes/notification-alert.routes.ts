import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createNotificationAlertSchema,
  updateNotificationAlertSchema,
} from "../validation/notification-alert.validation";
import {
  createNotificationAlert,
  getAllNotificationAlerts,
  getNotificationAlert,
  updateNotificationAlert,
  deleteNotificationAlert,
} from "../controllers/notification-alert.controller";

const router = Router();

router.post("/notification-alert", validate(createNotificationAlertSchema), createNotificationAlert);
router.get("/notification-alert", getAllNotificationAlerts);
router.get("/notification-alert/:id", getNotificationAlert);
router.put("/notification-alert/:id", validate(updateNotificationAlertSchema), updateNotificationAlert);
router.delete("/notification-alert/:id", deleteNotificationAlert);

export default router;
