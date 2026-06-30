import { z } from "zod";
export declare const createPaymentGatewaySchema: z.ZodObject<{
    branch_id: z.ZodNumber;
    upi_id: z.ZodOptional<z.ZodString>;
    gpay_no: z.ZodOptional<z.ZodString>;
    qr_code: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    creator_type: z.ZodOptional<z.ZodString>;
    creator_id: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updatePaymentGatewaySchema: z.ZodObject<{
    branch_id: z.ZodOptional<z.ZodNumber>;
    upi_id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    gpay_no: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    qr_code: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodNumber>>>;
    creator_type: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    creator_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
