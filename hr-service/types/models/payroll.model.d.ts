declare const Model: any;
import { Optional } from "sequelize";
export interface IPayroll {
    id: number;
    branch_id?: number;
    date: Date;
    employee_id: number;
    amount: number;
    payment_choice: string;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
type PayrollCreationAttributes = Optional<IPayroll, "id">;
declare class Payroll extends Model<IPayroll, PayrollCreationAttributes> implements IPayroll {
    id: number;
    branch_id?: number;
    date: Date;
    employee_id: number;
    amount: number;
    payment_choice: string;
}
export default Payroll;
