declare const Model: any;
import { Optional } from "sequelize";
export interface ILeaveType {
    id: number;
    title: string;
    branch_id: number;
}
type LeaveTypeCreationAttributes = Optional<ILeaveType, "id">;
declare class LeaveType extends Model<ILeaveType, LeaveTypeCreationAttributes> implements ILeaveType {
    id: number;
    title: string;
    branch_id: number;
}
export default LeaveType;
