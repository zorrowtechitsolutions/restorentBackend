declare const Model: any;
import { Optional } from "sequelize";
export interface IItemCategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    status: number;
    sort: number;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    branch_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
type ItemCategoryCreationAttributes = Optional<IItemCategory, "id" | "status" | "sort">;
declare class ItemCategory extends Model<IItemCategory, ItemCategoryCreationAttributes> implements IItemCategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    status: number;
    sort: number;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    branch_id?: number;
}
export default ItemCategory;
