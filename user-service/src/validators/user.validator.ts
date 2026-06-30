import { z } from "zod";

// ─── REGISTER ──────────────────────────────────────────────
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(1, "Phone is required"),
  username: z.string().min(1, "Username is required").optional(),
  image: z.string().url().optional(),
  branch_id: z.number().optional(),
  country_code: z.string().optional(),
  is_guest: z.boolean().optional().default(false),
  status: z.number().optional().default(1),
  balance: z.number().optional().default(0),
  role_id: z.number(),
});

// ─── LOGIN ─────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().optional(),
  password: z.string().min(1, "Password is required"),
});

// ─── UPDATE USER ───────────────────────────────────────────
export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  username: z.string().min(1).optional(),
  image: z.string().url().optional(),
  branch_id: z.number().optional(),
  country_code: z.string().optional(),
  is_guest: z.boolean().optional(),
  status: z.number().optional(),
  balance: z.number().optional(),
  role_id: z.number().optional(),
  device_token: z.string().optional(),
  web_token: z.string().optional(),
});

// ─── ID PARAM VALIDATION ──────────────────────────────────
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number"),
});

// ─── CHANGE PASSWORD ──────────────────────────────────────
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ─── RESET PASSWORD ───────────────────────────────────────
export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ─── PHONE & OTP VALIDATION ───────────────────────────────
export const loginWithPhoneSchema = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be a 10-digit number"),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be a 10-digit number"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  fcmToken: z.string().optional(),
});

// ─── EMAIL OTP FLOW ───────────────────────────────────────
export const sendOtpEmailSchema = z.object({
  email: z.string().email(),
});

export const verifyOtpEmailSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export const resetPasswordEmailSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

