declare const Model: any;
import { Optional } from "sequelize";
export interface IItemExtra {
    id: number;
    name: string;
    item_id: number;
    price: number;
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
type ItemExtraCreationAttributes = Optional<IItemExtra, "id" | "status">;
declare class ItemExtra extends Model<IItemExtra, ItemExtraCreationAttributes> implements IItemExtra {
    id: number;
    name: string;
    item_id: number;
    price: number;
    status: number;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    branch_id?: number;
}
export default ItemExtra;
