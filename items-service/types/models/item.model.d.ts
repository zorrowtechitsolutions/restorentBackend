declare const Model: any;
import { Optional } from "sequelize";
export interface IItem {
    id: number;
    item_category_id: number;
    tax_id?: number;
    name: string;
    slug: string;
    image?: string;
    caution?: string;
    description?: string;
    price: number;
    status: number;
    item_type: string;
    order: number;
    is_featured: boolean;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    branch_id?: number;
    preparation_time?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
type ItemCreationAttributes = Optional<IItem, "id" | "status" | "order" | "is_featured" | "preparation_time">;
declare class Item extends Model<IItem, ItemCreationAttributes> implements IItem {
    id: number;
    item_category_id: number;
    tax_id?: number;
    name: string;
    slug: string;
    image?: string;
    caution?: string;
    description?: string;
    price: number;
    status: number;
    item_type: string;
    order: number;
    is_featured: boolean;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    branch_id?: number;
    preparation_time?: number;
}
export default Item;
