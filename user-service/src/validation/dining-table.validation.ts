import { z } from "zod";

export const createDiningTableSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  size: z.number().int().min(1, "Size must be at least 1"),
  qr_code: z.string().optional(),
  branch_id: z.number().int(),
  status: z.number().int().optional().default(1),
  creator_type: z.string().optional(),
  creator_id: z.number().int().optional(),
});

export const updateDiningTableSchema = createDiningTableSchema.partial();
