import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodString;
    username: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    branch_id: z.ZodOptional<z.ZodNumber>;
    country_code: z.ZodOptional<z.ZodString>;
    is_guest: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    status: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    balance: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    role_id: z.ZodNumber;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
}, z.core.$strip>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    branch_id: z.ZodOptional<z.ZodNumber>;
    country_code: z.ZodOptional<z.ZodString>;
    is_guest: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodNumber>;
    balance: z.ZodOptional<z.ZodNumber>;
    role_id: z.ZodOptional<z.ZodNumber>;
    device_token: z.ZodOptional<z.ZodString>;
    web_token: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export declare const resetPasswordSchema: z.ZodObject<{
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export declare const loginWithPhoneSchema: z.ZodObject<{
    phone: z.ZodString;
}, z.core.$strip>;
export declare const verifyOtpSchema: z.ZodObject<{
    phone: z.ZodString;
    otp: z.ZodString;
    fcmToken: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const sendOtpEmailSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export declare const verifyOtpEmailSchema: z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
}, z.core.$strip>;
export declare const resetPasswordEmailSchema: z.ZodObject<{
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
