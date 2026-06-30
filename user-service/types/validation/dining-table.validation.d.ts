import { z } from "zod";
export declare const createDiningTableSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    size: z.ZodNumber;
    qr_code: z.ZodOptional<z.ZodString>;
    branch_id: z.ZodNumber;
    status: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    creator_type: z.ZodOptional<z.ZodString>;
    creator_id: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateDiningTableSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodNumber>;
    qr_code: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    branch_id: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodNumber>>>;
    creator_type: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    creator_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
