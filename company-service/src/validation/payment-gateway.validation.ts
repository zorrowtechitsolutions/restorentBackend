import { z } from "zod";

export const createPaymentGatewaySchema = z.object({
  branch_id: z.number().int().positive("Branch ID is required"),
  upi_id: z.string().optional(),
  gpay_no: z.string().optional(),
  qr_code: z.string().optional(),
  status: z.number().optional().default(1),
  creator_type: z.string().optional(),
  creator_id: z.number().optional(),
});

export const updatePaymentGatewaySchema = createPaymentGatewaySchema.partial();
