import Notification from "../models/notification.model";
import { logger } from "../utils/logger";

export const handleOfficeShiftEvent = async (routingKey: string, data: any) => {
  try {
    const action = routingKey.split('_').pop()?.toLowerCase() || 'processed';
    const message = `Office shift ${action}: ${data.name || data.id || ''}`.trim();
    await Notification.create({
      employeeIds: data.employeeIds || (data.employeeId ? [data.employeeId] : []),
      message,
    });
  } catch (error: any) {
    logger.error("Error in handleOfficeShiftEvent:", { error: error.message });
  }
};
