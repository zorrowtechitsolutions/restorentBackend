import { z } from "zod";
export declare const officeShiftSchema: z.ZodObject<{
    name: z.ZodString;
    branch_id: z.ZodNumber;
    monday_in: z.ZodOptional<z.ZodString>;
    monday_out: z.ZodOptional<z.ZodString>;
    tuesday_in: z.ZodOptional<z.ZodString>;
    tuesday_out: z.ZodOptional<z.ZodString>;
    wednesday_in: z.ZodOptional<z.ZodString>;
    wednesday_out: z.ZodOptional<z.ZodString>;
    thursday_in: z.ZodOptional<z.ZodString>;
    thursday_out: z.ZodOptional<z.ZodString>;
    friday_in: z.ZodOptional<z.ZodString>;
    friday_out: z.ZodOptional<z.ZodString>;
    saturday_in: z.ZodOptional<z.ZodString>;
    saturday_out: z.ZodOptional<z.ZodString>;
    sunday_in: z.ZodOptional<z.ZodString>;
    sunday_out: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    branch_id?: number;
    monday_in?: string;
    monday_out?: string;
    tuesday_in?: string;
    tuesday_out?: string;
    wednesday_in?: string;
    wednesday_out?: string;
    thursday_in?: string;
    thursday_out?: string;
    friday_in?: string;
    friday_out?: string;
    saturday_in?: string;
    saturday_out?: string;
    sunday_in?: string;
    sunday_out?: string;
}, {
    name?: string;
    branch_id?: number;
    monday_in?: string;
    monday_out?: string;
    tuesday_in?: string;
    tuesday_out?: string;
    wednesday_in?: string;
    wednesday_out?: string;
    thursday_in?: string;
    thursday_out?: string;
    friday_in?: string;
    friday_out?: string;
    saturday_in?: string;
    saturday_out?: string;
    sunday_in?: string;
    sunday_out?: string;
}>;
export declare const updateOfficeShiftSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    branch_id: z.ZodOptional<z.ZodNumber>;
    monday_in: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    monday_out: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tuesday_in: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tuesday_out: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    wednesday_in: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    wednesday_out: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    thursday_in: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    thursday_out: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    friday_in: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    friday_out: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    saturday_in: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    saturday_out: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sunday_in: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sunday_out: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    branch_id?: number;
    monday_in?: string;
    monday_out?: string;
    tuesday_in?: string;
    tuesday_out?: string;
    wednesday_in?: string;
    wednesday_out?: string;
    thursday_in?: string;
    thursday_out?: string;
    friday_in?: string;
    friday_out?: string;
    saturday_in?: string;
    saturday_out?: string;
    sunday_in?: string;
    sunday_out?: string;
}, {
    name?: string;
    branch_id?: number;
    monday_in?: string;
    monday_out?: string;
    tuesday_in?: string;
    tuesday_out?: string;
    wednesday_in?: string;
    wednesday_out?: string;
    thursday_in?: string;
    thursday_out?: string;
    friday_in?: string;
    friday_out?: string;
    saturday_in?: string;
    saturday_out?: string;
    sunday_in?: string;
    sunday_out?: string;
}>;
export declare const attendanceSchema: z.ZodEffects<z.ZodObject<{
    branch_id: z.ZodNumber;
    emp_id: z.ZodNumber;
    type: z.ZodEnum<["check-in", "check-out"]>;
    image: z.ZodOptional<z.ZodString>;
    selfie_url: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    latitude: z.ZodOptional<z.ZodNumber>;
    longitude: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lat?: number;
        lng?: number;
    }, {
        lat?: number;
        lng?: number;
    }>>;
    status: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    branch_id?: number;
    type?: "check-in" | "check-out";
    status?: string;
    emp_id?: number;
    image?: string;
    selfie_url?: string;
    timestamp?: string | Date;
    latitude?: number;
    longitude?: number;
    location?: {
        lat?: number;
        lng?: number;
    };
}, {
    branch_id?: number;
    type?: "check-in" | "check-out";
    status?: string;
    emp_id?: number;
    image?: string;
    selfie_url?: string;
    timestamp?: string | Date;
    latitude?: number;
    longitude?: number;
    location?: {
        lat?: number;
        lng?: number;
    };
}>, {
    branch_id?: number;
    type?: "check-in" | "check-out";
    status?: string;
    emp_id?: number;
    image?: string;
    selfie_url?: string;
    timestamp?: string | Date;
    latitude?: number;
    longitude?: number;
    location?: {
        lat?: number;
        lng?: number;
    };
}, {
    branch_id?: number;
    type?: "check-in" | "check-out";
    status?: string;
    emp_id?: number;
    image?: string;
    selfie_url?: string;
    timestamp?: string | Date;
    latitude?: number;
    longitude?: number;
    location?: {
        lat?: number;
        lng?: number;
    };
}>;
export declare const updateAttendanceSchema: z.ZodObject<{
    branch_id: z.ZodOptional<z.ZodNumber>;
    emp_id: z.ZodOptional<z.ZodNumber>;
    type: z.ZodOptional<z.ZodEnum<["check-in", "check-out"]>>;
    image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    selfie_url: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    timestamp: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>>;
    latitude: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    longitude: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    location: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lat?: number;
        lng?: number;
    }, {
        lat?: number;
        lng?: number;
    }>>>;
    status: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    branch_id?: number;
    type?: "check-in" | "check-out";
    status?: string;
    emp_id?: number;
    image?: string;
    selfie_url?: string;
    timestamp?: string | Date;
    latitude?: number;
    longitude?: number;
    location?: {
        lat?: number;
        lng?: number;
    };
}, {
    branch_id?: number;
    type?: "check-in" | "check-out";
    status?: string;
    emp_id?: number;
    image?: string;
    selfie_url?: string;
    timestamp?: string | Date;
    latitude?: number;
    longitude?: number;
    location?: {
        lat?: number;
        lng?: number;
    };
}>;
export declare const leaveTypeSchema: z.ZodObject<{
    title: z.ZodString;
    branch_id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    branch_id?: number;
    title?: string;
}, {
    branch_id?: number;
    title?: string;
}>;
export declare const updateLeaveTypeSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    branch_id: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    branch_id?: number;
    title?: string;
}, {
    branch_id?: number;
    title?: string;
}>;
export declare const leaveRequestSchema: z.ZodObject<{
    branch_id: z.ZodNumber;
    employee_name: z.ZodString;
    emp_id: z.ZodNumber;
    leave_type_id: z.ZodNumber;
    start_date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    end_date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected"]>>>;
    attachment: z.ZodOptional<z.ZodString>;
    leave_reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    branch_id?: number;
    status?: "pending" | "approved" | "rejected";
    emp_id?: number;
    employee_name?: string;
    leave_type_id?: number;
    start_date?: string | Date;
    end_date?: string | Date;
    attachment?: string;
    leave_reason?: string;
}, {
    branch_id?: number;
    status?: "pending" | "approved" | "rejected";
    emp_id?: number;
    employee_name?: string;
    leave_type_id?: number;
    start_date?: string | Date;
    end_date?: string | Date;
    attachment?: string;
    leave_reason?: string;
}>;
export declare const updateLeaveRequestSchema: z.ZodObject<{
    branch_id: z.ZodOptional<z.ZodNumber>;
    employee_name: z.ZodOptional<z.ZodString>;
    emp_id: z.ZodOptional<z.ZodNumber>;
    leave_type_id: z.ZodOptional<z.ZodNumber>;
    start_date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    end_date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected"]>>>>;
    attachment: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    leave_reason: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    branch_id?: number;
    status?: "pending" | "approved" | "rejected";
    emp_id?: number;
    employee_name?: string;
    leave_type_id?: number;
    start_date?: string | Date;
    end_date?: string | Date;
    attachment?: string;
    leave_reason?: string;
}, {
    branch_id?: number;
    status?: "pending" | "approved" | "rejected";
    emp_id?: number;
    employee_name?: string;
    leave_type_id?: number;
    start_date?: string | Date;
    end_date?: string | Date;
    attachment?: string;
    leave_reason?: string;
}>;
export declare const holidaySchema: z.ZodObject<{
    branch_id: z.ZodNumber;
    title: z.ZodString;
    start_date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    end_date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    details: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    branch_id?: number;
    title?: string;
    start_date?: string | Date;
    end_date?: string | Date;
    details?: string;
}, {
    branch_id?: number;
    title?: string;
    start_date?: string | Date;
    end_date?: string | Date;
    details?: string;
}>;
export declare const updateHolidaySchema: z.ZodObject<{
    branch_id: z.ZodOptional<z.ZodNumber>;
    title: z.ZodOptional<z.ZodString>;
    start_date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    end_date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    details: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    branch_id?: number;
    title?: string;
    start_date?: string | Date;
    end_date?: string | Date;
    details?: string;
}, {
    branch_id?: number;
    title?: string;
    start_date?: string | Date;
    end_date?: string | Date;
    details?: string;
}>;
export declare const payrollSchema: z.ZodObject<{
    branch_id: z.ZodOptional<z.ZodNumber>;
    date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    employee_id: z.ZodNumber;
    amount: z.ZodNumber;
    payment_choice: z.ZodString;
}, "strip", z.ZodTypeAny, {
    branch_id?: number;
    date?: string | Date;
    employee_id?: number;
    amount?: number;
    payment_choice?: string;
}, {
    branch_id?: number;
    date?: string | Date;
    employee_id?: number;
    amount?: number;
    payment_choice?: string;
}>;
export declare const updatePayrollSchema: z.ZodObject<{
    branch_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    employee_id: z.ZodOptional<z.ZodNumber>;
    amount: z.ZodOptional<z.ZodNumber>;
    payment_choice: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    branch_id?: number;
    date?: string | Date;
    employee_id?: number;
    amount?: number;
    payment_choice?: string;
}, {
    branch_id?: number;
    date?: string | Date;
    employee_id?: number;
    amount?: number;
    payment_choice?: string;
}>;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id?: string;
}, {
    id?: string;
}>;
