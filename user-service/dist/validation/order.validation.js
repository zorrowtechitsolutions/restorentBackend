"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const orderItemSchema = zod_1.z.object({
    item_id: zod_1.z.number().int(),
    branch_id: zod_1.z.number().int(),
    quantity: zod_1.z.number().int().min(1),
    discount: zod_1.z.number().optional().default(0),
    tax_name: zod_1.z.string(),
    tax_rate: zod_1.z.number(),
    tax_amount: zod_1.z.number(),
    price: zod_1.z.number(),
    item_variations: zod_1.z.array(zod_1.z.any()).optional(),
    item_extras: zod_1.z.array(zod_1.z.any()).optional(),
    item_variation_total: zod_1.z.number().optional().default(0),
    item_extra_total: zod_1.z.number().optional().default(0),
    total_price: zod_1.z.number(),
    instruction: zod_1.z.string().optional(),
});
exports.createOrderSchema = zod_1.z.object({
    user_id: zod_1.z.number().int(),
    branch_id: zod_1.z.number().int(),
    subtotal: zod_1.z.number(),
    discount: zod_1.z.number().optional().default(0),
    delivery_charge: zod_1.z.number().optional().default(0),
    total_tax: zod_1.z.number().optional().default(0),
    total: zod_1.z.number(),
    order_type: zod_1.z.number().int(),
    is_advance_order: zod_1.z.boolean().optional().default(false),
    pos_payment_method: zod_1.z.number().int().optional(),
    pos_received_amount: zod_1.z.number().optional(),
    payment_status: zod_1.z.number().int().optional().default(0),
    status: zod_1.z.number().int().optional().default(0),
    dining_table_id: zod_1.z.number().int().optional(),
    delivery_boy_id: zod_1.z.number().int().optional(),
    source: zod_1.z.number().int(),
    delivery: zod_1.z.object({
        distance_km: zod_1.z.number().min(0).optional(),
        calculated_delivery_charge: zod_1.z.number().min(0).optional()
    }).optional(),
    orderItems: zod_1.z.array(orderItemSchema).min(1, "Order must have at least one item"),
});
exports.updateOrderSchema = exports.createOrderSchema.partial();
//# sourceMappingURL=order.validation.js.map