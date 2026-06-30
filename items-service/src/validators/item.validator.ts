import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  tax: z.number().min(0, "Tax must be a positive number").optional().default(0),
  image: z.string().url("Valid image URL required").optional(),
  itemType: z.enum(["Veg", "Non Veg"]),
  isFeatured: z.boolean().optional().default(false),
  status: z.enum(["Active", "Inactive"]).optional().default("Active"),
  caution: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  createdBy: z.number().optional(),
});

export const updateItemSchema = createItemSchema.partial();
