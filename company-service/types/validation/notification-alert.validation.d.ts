import { z } from "zod";
export declare const createNotificationAlertSchema: z.ZodObject<{
    branch_id: z.ZodNumber;
    name: z.ZodString;
    mail_message: z.ZodOptional<z.ZodString>;
    sms_message: z.ZodOptional<z.ZodString>;
    push_notification_message: z.ZodOptional<z.ZodString>;
    mail: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    sms: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    push_notification: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    creator_type: z.ZodOptional<z.ZodString>;
    creator_id: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateNotificationAlertSchema: z.ZodObject<{
    branch_id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
    mail_message: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sms_message: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    push_notification_message: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    mail: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    sms: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    push_notification: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    creator_type: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    creator_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
