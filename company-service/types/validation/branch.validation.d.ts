import { z } from "zod";
export declare const createBranchSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodNumber>;
    longitude: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    creator_type: z.ZodOptional<z.ZodString>;
    creator_id: z.ZodOptional<z.ZodNumber>;
    license_code: z.ZodOptional<z.ZodString>;
    branch_id: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role_id: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateBranchSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    latitude: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    longitude: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodNumber>>>;
    creator_type: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    creator_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    license_code: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    branch_id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    password: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    role_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
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
