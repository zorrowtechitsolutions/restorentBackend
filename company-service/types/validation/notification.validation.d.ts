import { z } from "zod";
export declare const createNotificationSchema: z.ZodObject<{
    branchIds: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNumber>>>;
    userIds: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNumber>>>;
    role_ids: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNumber>>>;
    message: z.ZodString;
}, z.core.$strip>;
export declare const updateNotificationSchema: z.ZodObject<{
    branchIds: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNumber>>>>;
    userIds: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNumber>>>>;
    role_ids: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodNumber>>>>;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
