import { z } from "zod";

export const itemCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  status: z.number().optional().default(1),
  sort: z.number().optional().default(0),
  creator_type: z.string().optional(),
  creator_id: z.number().optional(),
  editor_type: z.string().optional(),
  editor_id: z.number().optional(),
  branch_id: z.number().optional(),
});
export const updateItemCategorySchema = itemCategorySchema.partial();

export const itemTaxSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  tax_rate: z.number().min(0),
  type: z.string().min(1),
  status: z.number().optional().default(1),
  creator_type: z.string().optional(),
  creator_id: z.number().optional(),
  editor_type: z.string().optional(),
  editor_id: z.number().optional(),
  branch_id: z.number().optional(),
});
export const updateItemTaxSchema = itemTaxSchema.partial();

export const itemAttributeSchema = z.object({
  name: z.string().min(1),
  status: z.number().optional().default(1),
  creator_type: z.string().optional(),
  creator_id: z.number().optional(),
  editor_type: z.string().optional(),
  editor_id: z.number().optional(),
  branch_id: z.number().optional(),
});
export const updateItemAttributeSchema = itemAttributeSchema.partial();

export const itemVariationSchema = z.object({
  item_id: z.number(),
  item_attribute_id: z.number(),
  name: z.string().min(1),
  price: z.number().min(0),
  caution: z.string().optional(),
  status: z.number().optional().default(1),
  creator_type: z.string().optional(),
  creator_id: z.number().optional(),
  editor_type: z.string().optional(),
  editor_id: z.number().optional(),
  branch_id: z.number().optional(),
});
export const updateItemVariationSchema = itemVariationSchema.partial();

export const itemExtraSchema = z.object({
  name: z.string().min(1),
  item_id: z.number(),
  price: z.number().min(0),
  status: z.number().optional().default(1),
  creator_type: z.string().optional(),
  creator_id: z.number().optional(),
  editor_type: z.string().optional(),
  editor_id: z.number().optional(),
  branch_id: z.number().optional(),
});
export const updateItemExtraSchema = itemExtraSchema.partial();

export const itemAddonSchema = z.object({
  item_id: z.number(),
  addon_item_id: z.number(),
  addon_item_variation: z.string().optional(),
  creator_type: z.string().optional(),
  creator_id: z.number().optional(),
  editor_type: z.string().optional(),
  editor_id: z.number().optional(),
  branch_id: z.number().optional(),
});
export const updateItemAddonSchema = itemAddonSchema.partial();

// Main Item Schema
export const createItemSchema = z.object({
  item_category_id: z.number(),
  tax_id: z.number().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().optional(),
  caution: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0),
  status: z.number().optional().default(1),
  item_type: z.string().min(1),
  order: z.number().optional().default(0),
  is_featured: z.boolean().optional().default(false),
  creator_type: z.string().optional(),
  creator_id: z.number().optional(),
  editor_type: z.string().optional(),
  editor_id: z.number().optional(),
  branch_id: z.number().optional(),
  preparation_time: z.number().min(0).optional(),
  variations: z.array(itemVariationSchema.omit({ item_id: true })).optional(),
  extras: z.array(itemExtraSchema.omit({ item_id: true })).optional(),
  addons: z.array(itemAddonSchema.omit({ item_id: true })).optional(),
});
export const updateItemSchema = createItemSchema.partial();

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number"),
});
