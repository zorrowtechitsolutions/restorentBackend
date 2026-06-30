import { z } from "zod";

export const createNotificationAlertSchema = z.object({
  branch_id: z.number().int().positive("Branch ID is required"),
  name: z.string().min(1, "Name is required"),
  mail_message: z.string().optional(),
  sms_message: z.string().optional(),
  push_notification_message: z.string().optional(),
  mail: z.boolean().optional().default(false),
  sms: z.boolean().optional().default(false),
  push_notification: z.boolean().optional().default(false),
  creator_type: z.string().optional(),
  creator_id: z.number().optional(),
});

export const updateNotificationAlertSchema = createNotificationAlertSchema.partial();
