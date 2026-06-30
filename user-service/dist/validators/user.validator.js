"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordEmailSchema = exports.verifyOtpEmailSchema = exports.sendOtpEmailSchema = exports.verifyOtpSchema = exports.loginWithPhoneSchema = exports.resetPasswordSchema = exports.changePasswordSchema = exports.idParamSchema = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// ─── REGISTER ──────────────────────────────────────────────
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    phone: zod_1.z.string().min(1, "Phone is required"),
    username: zod_1.z.string().min(1, "Username is required").optional(),
    image: zod_1.z.string().url().optional(),
    branch_id: zod_1.z.number().optional(),
    country_code: zod_1.z.string().optional(),
    is_guest: zod_1.z.boolean().optional().default(false),
    status: zod_1.z.number().optional().default(1),
    balance: zod_1.z.number().optional().default(0),
    role_id: zod_1.z.number(),
});
// ─── LOGIN ─────────────────────────────────────────────────
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email().optional(),
    username: zod_1.z.string().optional(),
    password: zod_1.z.string().min(1, "Password is required"),
});
// ─── UPDATE USER ───────────────────────────────────────────
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().min(1).optional(),
    username: zod_1.z.string().min(1).optional(),
    image: zod_1.z.string().url().optional(),
    branch_id: zod_1.z.number().optional(),
    country_code: zod_1.z.string().optional(),
    is_guest: zod_1.z.boolean().optional(),
    status: zod_1.z.number().optional(),
    balance: zod_1.z.number().optional(),
    role_id: zod_1.z.number().optional(),
    device_token: zod_1.z.string().optional(),
    web_token: zod_1.z.string().optional(),
});
// ─── ID PARAM VALIDATION ──────────────────────────────────
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/, "ID must be a number"),
});
// ─── CHANGE PASSWORD ──────────────────────────────────────
exports.changePasswordSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(1, "Current password is required"),
    newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: zod_1.z.string().min(6, "Confirm password is required"),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
// ─── RESET PASSWORD ───────────────────────────────────────
exports.resetPasswordSchema = zod_1.z
    .object({
    newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: zod_1.z.string().min(6, "Confirm password is required"),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
// ─── PHONE & OTP VALIDATION ───────────────────────────────
exports.loginWithPhoneSchema = zod_1.z.object({
    phone: zod_1.z.string().regex(/^[0-9]{10}$/, "Phone must be a 10-digit number"),
});
exports.verifyOtpSchema = zod_1.z.object({
    phone: zod_1.z.string().regex(/^[0-9]{10}$/, "Phone must be a 10-digit number"),
    otp: zod_1.z.string().length(6, "OTP must be exactly 6 digits"),
    fcmToken: zod_1.z.string().optional(),
});
// ─── EMAIL OTP FLOW ───────────────────────────────────────
exports.sendOtpEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.verifyOtpEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    otp: zod_1.z.string().length(6, "OTP must be exactly 6 digits"),
});
exports.resetPasswordEmailSchema = zod_1.z
    .object({
    newPassword: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: zod_1.z.string().min(8, "Confirm password must be at least 8 characters long"),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
//# sourceMappingURL=user.validator.js.map