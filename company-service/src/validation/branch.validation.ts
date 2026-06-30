import { z } from "zod";

export const createBranchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  image: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  status: z.number().optional().default(1),
  creator_type: z.string().optional(),
  creator_id: z.number().optional(),
  license_code: z.string().optional(),
  branch_id: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role_id: z.number().optional(),
});

export const updateBranchSchema = createBranchSchema.partial();

export const loginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(1, "Password is required"),
});

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

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginWithPhoneSchema = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be a 10-digit number"),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be a 10-digit number"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  fcmToken: z.string().optional(),
});

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
