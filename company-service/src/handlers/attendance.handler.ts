import Notification from "../models/notification.model";
import { logger } from "../utils/logger";

export const handleAttendanceEvent = async (routingKey: string, data: any) => {
  try {
    const action = routingKey.split('_').pop()?.toLowerCase() || 'processed';
    const message = `Attendance ${action} for user ${data.emp_id || data.userId || ''}`.trim();
    await Notification.create({
      administratorIds: data.administratorIds || (data.administratorId ? [data.administratorId] : []),
      message,
    });
  } catch (error: any) {
    logger.error("Error in handleAttendanceEvent:", { error: error.message });
  }
};
