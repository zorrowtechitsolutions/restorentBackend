import { z } from "zod";

export const createNotificationSchema = z.object({
  branchIds: z.array(z.number()).optional().default([]),
  userIds: z.array(z.number()).optional().default([]),
  role_ids: z.array(z.number()).optional().default([]),
  message: z.string().min(1, "Message is required"),
});

export const updateNotificationSchema = createNotificationSchema.partial();
