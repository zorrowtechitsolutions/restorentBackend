declare const Model: any;
import { Optional } from "sequelize";
export interface IItemTax {
    id: number;
    name: string;
    code: string;
    tax_rate: number;
    type: string;
    status: number;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    branch_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
type ItemTaxCreationAttributes = Optional<IItemTax, "id" | "status">;
declare class ItemTax extends Model<IItemTax, ItemTaxCreationAttributes> implements IItemTax {
    id: number;
    name: string;
    code: string;
    tax_rate: number;
    type: string;
    status: number;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    branch_id?: number;
}
export default ItemTax;
