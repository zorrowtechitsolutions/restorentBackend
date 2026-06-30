import { z } from "zod";

export const offerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  amount: z.number().min(0, "Amount must be a positive number"),
  image: z.string().url("Valid image URL required").optional(),
  status: z.number().optional().default(1),
  start_date: z.string().or(z.date()),
  end_date: z.string().or(z.date()),
  branch_id: z.number().optional(),
  creator_type: z.string().optional(),
  creator_id: z.number().optional(),
  editor_type: z.string().optional(),
  editor_id: z.number().optional(),
});

export const updateOfferSchema = offerSchema.partial();

export const offerItemSchema = z.object({
  offer_id: z.number().int(),
  item_id: z.number().int(),
  branch_id: z.number().optional(),
  creator_type: z.string().optional(),
  creator_id: z.number().optional(),
  editor_type: z.string().optional(),
  editor_id: z.number().optional(),
});

export const updateOfferItemSchema = offerItemSchema.partial();
