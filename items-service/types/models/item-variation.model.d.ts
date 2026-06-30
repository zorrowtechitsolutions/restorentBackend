declare const Model: any;
import { Optional } from "sequelize";
export interface IItemVariation {
    id: number;
    item_id: number;
    item_attribute_id: number;
    name: string;
    price: number;
    caution?: string;
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
type ItemVariationCreationAttributes = Optional<IItemVariation, "id" | "status">;
declare class ItemVariation extends Model<IItemVariation, ItemVariationCreationAttributes> implements IItemVariation {
    id: number;
    item_id: number;
    item_attribute_id: number;
    name: string;
    price: number;
    caution?: string;
    status: number;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    branch_id?: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date;
}
export default ItemVariation;
