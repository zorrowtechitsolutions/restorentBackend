import Notification from "../models/notification.model";
import { logger } from "../utils/logger";

export const handleOfferEvent = async (routingKey: string, data: any) => {
  try {
    const action = routingKey.split('_').pop()?.toLowerCase() || 'processed';
    const message = `Offer ${action}: ${data.name || data.id || ''}`.trim();
    await Notification.create({
      employeeIds: data.employeeIds || (data.employeeId ? [data.employeeId] : []),
      staffIds: data.staffIds || (data.staffId ? [data.staffId] : []),
      message,
    });
  } catch (error: any) {
    logger.error("Error in handleOfferEvent:", { error: error.message });
  }
};
