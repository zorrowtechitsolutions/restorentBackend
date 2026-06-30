import Notification from "../models/notification.model";
import { logger } from "../utils/logger";

export const handleLeaveRequestEvent = async (routingKey: string, data: any) => {
  try {
    const action = routingKey.split('_').pop()?.toLowerCase() || 'processed';
    const message = `Leave request ${action} for user ${data.emp_id || data.userId || ''}`.trim();
    await Notification.create({
      administratorIds: data.administratorIds || (data.administratorId ? [data.administratorId] : []),
      message,
    });
  } catch (error: any) {
    logger.error("Error in handleLeaveRequestEvent:", { error: error.message });
  }
};
