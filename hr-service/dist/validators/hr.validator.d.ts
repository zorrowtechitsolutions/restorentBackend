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
    name: string;
    branch_id: number;
    monday_in?: string | undefined;
    monday_out?: string | undefined;
    tuesday_in?: string | undefined;
    tuesday_out?: string | undefined;
    wednesday_in?: string | undefined;
    wednesday_out?: string | undefined;
    thursday_in?: string | undefined;
    thursday_out?: string | undefined;
    friday_in?: string | undefined;
    friday_out?: string | undefined;
    saturday_in?: string | undefined;
    saturday_out?: string | undefined;
    sunday_in?: string | undefined;
    sunday_out?: string | undefined;
}, {
    name: string;
    branch_id: number;
    monday_in?: string | undefined;
    monday_out?: string | undefined;
    tuesday_in?: string | undefined;
    tuesday_out?: string | undefined;
    wednesday_in?: string | undefined;
    wednesday_out?: string | undefined;
    thursday_in?: string | undefined;
    thursday_out?: string | undefined;
    friday_in?: string | undefined;
    friday_out?: string | undefined;
    saturday_in?: string | undefined;
    saturday_out?: string | undefined;
    sunday_in?: string | undefined;
    sunday_out?: string | undefined;
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
    name?: string | undefined;
    branch_id?: number | undefined;
    monday_in?: string | undefined;
    monday_out?: string | undefined;
    tuesday_in?: string | undefined;
    tuesday_out?: string | undefined;
    wednesday_in?: string | undefined;
    wednesday_out?: string | undefined;
    thursday_in?: string | undefined;
    thursday_out?: string | undefined;
    friday_in?: string | undefined;
    friday_out?: string | undefined;
    saturday_in?: string | undefined;
    saturday_out?: string | undefined;
    sunday_in?: string | undefined;
    sunday_out?: string | undefined;
}, {
    name?: string | undefined;
    branch_id?: number | undefined;
    monday_in?: string | undefined;
    monday_out?: string | undefined;
    tuesday_in?: string | undefined;
    tuesday_out?: string | undefined;
    wednesday_in?: string | undefined;
    wednesday_out?: string | undefined;
    thursday_in?: string | undefined;
    thursday_out?: string | undefined;
    friday_in?: string | undefined;
    friday_out?: string | undefined;
    saturday_in?: string | undefined;
    saturday_out?: string | undefined;
    sunday_in?: string | undefined;
    sunday_out?: string | undefined;
}>;
export declare const attendanceSchema: z.ZodObject<{
    branch_id: z.ZodNumber;
    emp_id: z.ZodNumber;
    attendance_date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    time_in: z.ZodOptional<z.ZodString>;
    time_out: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    branch_id: number;
    emp_id: number;
    attendance_date: string | Date;
    time_in?: string | undefined;
    time_out?: string | undefined;
}, {
    branch_id: number;
    emp_id: number;
    attendance_date: string | Date;
    time_in?: string | undefined;
    time_out?: string | undefined;
}>;
export declare const updateAttendanceSchema: z.ZodObject<{
    branch_id: z.ZodOptional<z.ZodNumber>;
    emp_id: z.ZodOptional<z.ZodNumber>;
    attendance_date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    time_in: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    time_out: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    branch_id?: number | undefined;
    emp_id?: number | undefined;
    attendance_date?: string | Date | undefined;
    time_in?: string | undefined;
    time_out?: string | undefined;
}, {
    branch_id?: number | undefined;
    emp_id?: number | undefined;
    attendance_date?: string | Date | undefined;
    time_in?: string | undefined;
    time_out?: string | undefined;
}>;
export declare const leaveTypeSchema: z.ZodObject<{
    title: z.ZodString;
    branch_id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    branch_id: number;
    title: string;
}, {
    branch_id: number;
    title: string;
}>;
export declare const updateLeaveTypeSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    branch_id: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    branch_id?: number | undefined;
    title?: string | undefined;
}, {
    branch_id?: number | undefined;
    title?: string | undefined;
}>;
export declare const leaveRequestSchema: z.ZodObject<{
    branch_id: z.ZodNumber;
    role_id: z.ZodOptional<z.ZodNumber>;
    employee_name: z.ZodString;
    emp_id: z.ZodNumber;
    leave_type_id: z.ZodNumber;
    start_date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    end_date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected"]>>>;
    attachment: z.ZodOptional<z.ZodString>;
    leave_reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    branch_id: number;
    status: "pending" | "approved" | "rejected";
    emp_id: number;
    employee_name: string;
    leave_type_id: number;
    start_date: string | Date;
    end_date: string | Date;
    role_id?: number | undefined;
    attachment?: string | undefined;
    leave_reason?: string | undefined;
}, {
    branch_id: number;
    emp_id: number;
    employee_name: string;
    leave_type_id: number;
    start_date: string | Date;
    end_date: string | Date;
    status?: "pending" | "approved" | "rejected" | undefined;
    role_id?: number | undefined;
    attachment?: string | undefined;
    leave_reason?: string | undefined;
}>;
export declare const updateLeaveRequestSchema: z.ZodObject<{
    branch_id: z.ZodOptional<z.ZodNumber>;
    role_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    employee_name: z.ZodOptional<z.ZodString>;
    emp_id: z.ZodOptional<z.ZodNumber>;
    leave_type_id: z.ZodOptional<z.ZodNumber>;
    start_date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    end_date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected"]>>>>;
    attachment: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    leave_reason: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    branch_id?: number | undefined;
    status?: "pending" | "approved" | "rejected" | undefined;
    emp_id?: number | undefined;
    role_id?: number | undefined;
    employee_name?: string | undefined;
    leave_type_id?: number | undefined;
    start_date?: string | Date | undefined;
    end_date?: string | Date | undefined;
    attachment?: string | undefined;
    leave_reason?: string | undefined;
}, {
    branch_id?: number | undefined;
    status?: "pending" | "approved" | "rejected" | undefined;
    emp_id?: number | undefined;
    role_id?: number | undefined;
    employee_name?: string | undefined;
    leave_type_id?: number | undefined;
    start_date?: string | Date | undefined;
    end_date?: string | Date | undefined;
    attachment?: string | undefined;
    leave_reason?: string | undefined;
}>;
export declare const holidaySchema: z.ZodObject<{
    branch_id: z.ZodNumber;
    title: z.ZodString;
    start_date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    end_date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    details: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    branch_id: number;
    title: string;
    start_date: string | Date;
    end_date: string | Date;
    details?: string | undefined;
}, {
    branch_id: number;
    title: string;
    start_date: string | Date;
    end_date: string | Date;
    details?: string | undefined;
}>;
export declare const updateHolidaySchema: z.ZodObject<{
    branch_id: z.ZodOptional<z.ZodNumber>;
    title: z.ZodOptional<z.ZodString>;
    start_date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    end_date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    details: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    branch_id?: number | undefined;
    title?: string | undefined;
    start_date?: string | Date | undefined;
    end_date?: string | Date | undefined;
    details?: string | undefined;
}, {
    branch_id?: number | undefined;
    title?: string | undefined;
    start_date?: string | Date | undefined;
    end_date?: string | Date | undefined;
    details?: string | undefined;
}>;
export declare const payrollSchema: z.ZodObject<{
    branch_id: z.ZodOptional<z.ZodNumber>;
    date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    employee_id: z.ZodNumber;
    amount: z.ZodNumber;
    payment_choice: z.ZodString;
}, "strip", z.ZodTypeAny, {
    date: string | Date;
    employee_id: number;
    amount: number;
    payment_choice: string;
    branch_id?: number | undefined;
}, {
    date: string | Date;
    employee_id: number;
    amount: number;
    payment_choice: string;
    branch_id?: number | undefined;
}>;
export declare const updatePayrollSchema: z.ZodObject<{
    branch_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    employee_id: z.ZodOptional<z.ZodNumber>;
    amount: z.ZodOptional<z.ZodNumber>;
    payment_choice: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    branch_id?: number | undefined;
    date?: string | Date | undefined;
    employee_id?: number | undefined;
    amount?: number | undefined;
    payment_choice?: string | undefined;
}, {
    branch_id?: number | undefined;
    date?: string | Date | undefined;
    employee_id?: number | undefined;
    amount?: number | undefined;
    payment_choice?: string | undefined;
}>;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
