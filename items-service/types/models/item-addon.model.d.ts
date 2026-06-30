declare const Model: any;
import { Optional } from "sequelize";
export interface IItemAddon {
    id: number;
    item_id: number;
    addon_item_id: number;
    addon_item_variation?: string;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    branch_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
type ItemAddonCreationAttributes = Optional<IItemAddon, "id">;
declare class ItemAddon extends Model<IItemAddon, ItemAddonCreationAttributes> implements IItemAddon {
    id: number;
    item_id: number;
    addon_item_id: number;
    addon_item_variation?: string;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    branch_id?: number;
}
export default ItemAddon;
