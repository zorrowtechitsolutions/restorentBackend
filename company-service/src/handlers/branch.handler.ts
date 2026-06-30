import Notification from "../models/notification.model";
import { logger } from "../utils/logger";

export const handleBranchEvent = async (routingKey: string, data: any) => {
  try {
    const action = routingKey.split('_').pop()?.toLowerCase() || 'processed';
    const message = `Branch ${action}: ${data.name || data.id || ''}`.trim();
    
    await Notification.create({
      superAdminIds: data.superAdminIds || (data.superAdminId ? [data.superAdminId] : []),
      branchIds: data.branchIds || (data.branchId ? [data.branchId] : []),
      message,
    });
  } catch (error: any) {
    logger.error("Error in handleBranchEvent:", { error: error.message });
  }
};
