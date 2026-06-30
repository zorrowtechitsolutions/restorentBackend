declare const Model: any;
import { Optional } from "sequelize";
export interface IAttendance {
    id: number;
    branch_id: number;
    emp_id: number;
    type: string;
    timestamp: Date;
    latitude?: number;
    longitude?: number;
    selfie_url?: string;
    status?: string;
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
    type: string;
    timestamp: Date;
    latitude?: number;
    longitude?: number;
    selfie_url?: string;
    status?: string;
}
export default Attendance;
