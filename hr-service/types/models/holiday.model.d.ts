declare const Model: any;
import { Optional } from "sequelize";
export interface IHoliday {
    id: number;
    branch_id: number;
    title: string;
    start_date: Date;
    end_date: Date;
    details?: string;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
type HolidayCreationAttributes = Optional<IHoliday, "id">;
declare class Holiday extends Model<IHoliday, HolidayCreationAttributes> implements IHoliday {
    id: number;
    branch_id: number;
    title: string;
    start_date: Date;
    end_date: Date;
    details?: string;
}
export default Holiday;
