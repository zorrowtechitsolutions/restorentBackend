import { z } from "zod";

const orderItemSchema = z.object({
  item_id: z.number().int(),
  branch_id: z.number().int(),
  quantity: z.number().int().min(1),
  discount: z.number().optional().default(0),
  tax_name: z.string(),
  tax_rate: z.number(),
  tax_amount: z.number(),
  price: z.number(),
  item_variations: z.array(z.any()).optional(),
  item_extras: z.array(z.any()).optional(),
  item_variation_total: z.number().optional().default(0),
  item_extra_total: z.number().optional().default(0),
  total_price: z.number(),
  instruction: z.string().optional(),
});

export const createOrderSchema = z.object({
  user_id: z.number().int(),
  branch_id: z.number().int(),
  subtotal: z.number(),
  discount: z.number().optional().default(0),
  delivery_charge: z.number().optional().default(0),
  total_tax: z.number().optional().default(0),
  total: z.number(),
  order_type: z.number().int(),
  is_advance_order: z.boolean().optional().default(false),
  pos_payment_method: z.number().int().optional(),
  pos_received_amount: z.number().optional(),
  payment_status: z.number().int().optional().default(0),
  status: z.number().int().optional().default(0),
  dining_table_id: z.number().int().optional(),
  delivery_boy_id: z.number().int().optional(),
  source: z.number().int(),
  delivery: z.object({
    distance_km: z.number().min(0).optional(),
    calculated_delivery_charge: z.number().min(0).optional()
  }).optional(),
  orderItems: z.array(orderItemSchema).min(1, "Order must have at least one item"),
});

export const updateOrderSchema = createOrderSchema.partial();
