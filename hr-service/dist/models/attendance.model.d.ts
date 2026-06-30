declare const Model: any;
import { Optional } from "sequelize";
export interface IAttendance {
    id: number;
    branch_id: number;
    emp_id: number;
    attendance_date: Date;
    time_in?: string;
    time_out?: string;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
type AttendanceCreationAttributes = Optional<IAttendance, "id">;
declare class Attendance extends Model<IAttendance, AttendanceCreationAttributes> implements IAttendance {
    id: number;
    branch_id: number;
    emp_id: number;
    attendance_date: Date;
    time_in?: string;
    time_out?: string;
}
export default Attendance;
