import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createNotificationSchema,
} from "../validation/notification.validation";
import {
  createNotification,
  getAllNotifications,
  getRoleNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notification.controller";

const router = Router();

router.post("/notification", validate(createNotificationSchema), createNotification);
router.get("/notification", getAllNotifications);
router.get("/notification/:role/:id", getRoleNotifications);
router.put("/notification/read/:notificationId/:role/:id", markAsRead);
router.delete("/notification/:id", deleteNotification);

export default router;
