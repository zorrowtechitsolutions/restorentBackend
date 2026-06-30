declare const Model: any;
import { Optional } from "sequelize";
export interface IItemAttribute {
    id: number;
    name: string;
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
type ItemAttributeCreationAttributes = Optional<IItemAttribute, "id" | "status">;
declare class ItemAttribute extends Model<IItemAttribute, ItemAttributeCreationAttributes> implements IItemAttribute {
    id: number;
    name: string;
    status: number;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    branch_id?: number;
}
export default ItemAttribute;
