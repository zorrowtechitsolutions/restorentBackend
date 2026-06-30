declare const Model: any;
import { Optional } from "sequelize";
export interface ILeaveRequest {
    id: number;
    branch_id: number;
    role_id?: number;
    employee_name: string;
    emp_id: number;
    leave_type_id: number;
    start_date: Date;
    end_date: Date;
    status: string;
    attachment?: string;
    leave_reason?: string;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
type LeaveRequestCreationAttributes = Optional<ILeaveRequest, "id" | "status">;
declare class LeaveRequest extends Model<ILeaveRequest, LeaveRequestCreationAttributes> implements ILeaveRequest {
    id: number;
    branch_id: number;
    role_id?: number;
    employee_name: string;
    emp_id: number;
    leave_type_id: number;
    start_date: Date;
    end_date: Date;
    status: string;
    attachment?: string;
    leave_reason?: string;
}
export default LeaveRequest;
