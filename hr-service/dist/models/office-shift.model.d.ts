declare const Model: any;
import { Optional } from "sequelize";
export interface IOfficeShift {
    id: number;
    name: string;
    branch_id: number;
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
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
type OfficeShiftCreationAttributes = Optional<IOfficeShift, "id">;
declare class OfficeShift extends Model<IOfficeShift, OfficeShiftCreationAttributes> implements IOfficeShift {
    id: number;
    name: string;
    branch_id: number;
    monday_in?: string;
    monday_out?: string;
}
export default OfficeShift;
