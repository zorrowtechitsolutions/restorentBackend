import Notification from "../models/notification.model";
import NotificationAlert from "../models/notification-alert.model";
import { logger } from "../utils/logger";

export const handleUserEvent = async (routingKey: string, data: any) => {
  try {
    const action = routingKey.split('_').pop()?.toLowerCase() || 'processed';
    const message = `User ${action}: ${data.email || data.userId || data.id || ''}`.trim();
    
    await Notification.create({
      superAdminIds: data.superAdminIds || (data.superAdminId ? [data.superAdminId] : []),
      message,
    });

    if (data.branchId) {
      await NotificationAlert.create({
        branch_id: data.branchId,
        name: "New User Registration",
        mail_message: message,
        status: 1
      });
    }
  } catch (error: any) {
    logger.error("Error in handleUserEvent:", { error: error.message });
  }
};
    