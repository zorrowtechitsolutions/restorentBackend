import { z } from "zod";

export const officeShiftSchema = z.object({
  name: z.string().min(1, "Name is required"),
  branch_id: z.number().int(),
  monday_in: z.string().optional(),
  monday_out: z.string().optional(),
  tuesday_in: z.string().optional(),
  tuesday_out: z.string().optional(),
  wednesday_in: z.string().optional(),
  wednesday_out: z.string().optional(),
  thursday_in: z.string().optional(),
  thursday_out: z.string().optional(),
  friday_in: z.string().optional(),
  friday_out: z.string().optional(),
  saturday_in: z.string().optional(),
  saturday_out: z.string().optional(),
  sunday_in: z.string().optional(),
  sunday_out: z.string().optional(),
});
export const updateOfficeShiftSchema = officeShiftSchema.partial();

const attendanceBaseSchema = z.object({
  branch_id: z.number().int(),
  emp_id: z.number().int(),
  type: z.enum(["check-in", "check-out"]),
  // `image` is the primary field for face verification (base64 or URL selfie)
  // `selfie_url` is a fallback alias used by some EMS-style frontends
  image: z.string().optional(),
  selfie_url: z.string().optional(),
  timestamp: z.string().or(z.date()).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  status: z.string().optional(),
});

export const attendanceSchema = attendanceBaseSchema.superRefine((data, ctx) => {
  const hasTopLevelCoordinates = data.latitude !== undefined && data.longitude !== undefined;
  const hasLocationObject = data.location?.lat !== undefined && data.location?.lng !== undefined;

  if (!hasTopLevelCoordinates && !hasLocationObject) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "latitude/longitude or location.lat/location.lng is required",
      path: ["location"],
    });
  }
});
export const updateAttendanceSchema = attendanceBaseSchema.partial();

export const leaveTypeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  branch_id: z.number().int(),
});
export const updateLeaveTypeSchema = leaveTypeSchema.partial();

export const leaveRequestSchema = z.object({
  branch_id: z.number().int(),
  employee_name: z.string().min(1),
  emp_id: z.number().int(), // Represents user_id from user-service
  leave_type_id: z.number().int(),
  start_date: z.string().or(z.date()),
  end_date: z.string().or(z.date()),
  status: z.enum(["pending", "approved", "rejected"]).optional().default("pending"),
  attachment: z.string().optional(),
  leave_reason: z.string().optional(),
});
export const updateLeaveRequestSchema = leaveRequestSchema.partial();

export const holidaySchema = z.object({
  branch_id: z.number().int(),
  title: z.string().min(1),
  start_date: z.string().or(z.date()),
  end_date: z.string().or(z.date()),
  details: z.string().optional(),
});
export const updateHolidaySchema = holidaySchema.partial();

export const payrollSchema = z.object({
  branch_id: z.number().int().optional(),
  date: z.string().or(z.date()),
  employee_id: z.number().int(),
  amount: z.number().min(0, "Amount must be a positive number"),
  payment_choice: z.string().min(1),
});
export const updatePayrollSchema = payrollSchema.partial();

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number"),
});
