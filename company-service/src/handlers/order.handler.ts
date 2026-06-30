import Notification from "../models/notification.model";
import { logger } from "../utils/logger";

export const handleOrderEvent = async (routingKey: string, data: any) => {
  try {
    const action = routingKey.split('_').pop()?.toLowerCase() || 'processed';
    const message = `Order ${action}: ${data.orderId || data.id || ''}`.trim();
    await Notification.create({
      branchIds: data.branchIds || (data.branchId ? [data.branchId] : []),
      customerIds: data.customerIds || (data.customerId ? [data.customerId] : []),
      employeeIds: data.employeeIds || (data.employeeId ? [data.employeeId] : []),
      chefIds: data.chefIds || (data.chefId ? [data.chefId] : []),
      message,
    });
    logger.info(`Successfully created Notification for order event: ${routingKey}`);
  } catch (error: any) {
    logger.error("Error in handleOrderEvent:", { error: error.message });
  }
};
