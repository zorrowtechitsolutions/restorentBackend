"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.updatePayrollSchema = exports.payrollSchema = exports.updateHolidaySchema = exports.holidaySchema = exports.updateLeaveRequestSchema = exports.leaveRequestSchema = exports.updateLeaveTypeSchema = exports.leaveTypeSchema = exports.updateAttendanceSchema = exports.attendanceSchema = exports.updateOfficeShiftSchema = exports.officeShiftSchema = void 0;
const zod_1 = require("zod");
exports.officeShiftSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    branch_id: zod_1.z.number().int(),
    monday_in: zod_1.z.string().optional(),
    monday_out: zod_1.z.string().optional(),
    tuesday_in: zod_1.z.string().optional(),
    tuesday_out: zod_1.z.string().optional(),
    wednesday_in: zod_1.z.string().optional(),
    wednesday_out: zod_1.z.string().optional(),
    thursday_in: zod_1.z.string().optional(),
    thursday_out: zod_1.z.string().optional(),
    friday_in: zod_1.z.string().optional(),
    friday_out: zod_1.z.string().optional(),
    saturday_in: zod_1.z.string().optional(),
    saturday_out: zod_1.z.string().optional(),
    sunday_in: zod_1.z.string().optional(),
    sunday_out: zod_1.z.string().optional(),
});
exports.updateOfficeShiftSchema = exports.officeShiftSchema.partial();
const attendanceBaseSchema = zod_1.z.object({
    branch_id: zod_1.z.number().int(),
    emp_id: zod_1.z.number().int(),
    type: zod_1.z.enum(["check-in", "check-out"]),
    // `image` is the primary field for face verification (base64 or URL selfie)
    // `selfie_url` is a fallback alias used by some EMS-style frontends
    image: zod_1.z.string().optional(),
    selfie_url: zod_1.z.string().optional(),
    timestamp: zod_1.z.string().or(zod_1.z.date()).optional(),
    latitude: zod_1.z.number().min(-90).max(90).optional(),
    longitude: zod_1.z.number().min(-180).max(180).optional(),
    location: zod_1.z.object({
        lat: zod_1.z.number().min(-90).max(90),
        lng: zod_1.z.number().min(-180).max(180),
    }).optional(),
    status: zod_1.z.string().optional(),
});
exports.attendanceSchema = attendanceBaseSchema.superRefine((data, ctx) => {
    const hasTopLevelCoordinates = data.latitude !== undefined && data.longitude !== undefined;
    const hasLocationObject = data.location?.lat !== undefined && data.location?.lng !== undefined;
    if (!hasTopLevelCoordinates && !hasLocationObject) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "latitude/longitude or location.lat/location.lng is required",
            path: ["location"],
        });
    }
});
exports.updateAttendanceSchema = attendanceBaseSchema.partial();
exports.leaveTypeSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    branch_id: zod_1.z.number().int(),
});
exports.updateLeaveTypeSchema = exports.leaveTypeSchema.partial();
exports.leaveRequestSchema = zod_1.z.object({
    branch_id: zod_1.z.number().int(),
    employee_name: zod_1.z.string().min(1),
    emp_id: zod_1.z.number().int(), // Represents user_id from user-service
    leave_type_id: zod_1.z.number().int(),
    start_date: zod_1.z.string().or(zod_1.z.date()),
    end_date: zod_1.z.string().or(zod_1.z.date()),
    status: zod_1.z.enum(["pending", "approved", "rejected"]).optional().default("pending"),
    attachment: zod_1.z.string().optional(),
    leave_reason: zod_1.z.string().optional(),
});
exports.updateLeaveRequestSchema = exports.leaveRequestSchema.partial();
exports.holidaySchema = zod_1.z.object({
    branch_id: zod_1.z.number().int(),
    title: zod_1.z.string().min(1),
    start_date: zod_1.z.string().or(zod_1.z.date()),
    end_date: zod_1.z.string().or(zod_1.z.date()),
    details: zod_1.z.string().optional(),
});
exports.updateHolidaySchema = exports.holidaySchema.partial();
exports.payrollSchema = zod_1.z.object({
    branch_id: zod_1.z.number().int().optional(),
    date: zod_1.z.string().or(zod_1.z.date()),
    employee_id: zod_1.z.number().int(),
    amount: zod_1.z.number().min(0, "Amount must be a positive number"),
    payment_choice: zod_1.z.string().min(1),
});
exports.updatePayrollSchema = exports.payrollSchema.partial();
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/, "ID must be a number"),
});
//# sourceMappingURL=hr.validator.js.map