declare const Model: any;
import { Optional } from "sequelize";
export interface IOfferItem {
    id: number;
    offer_id: number;
    item_id: number;
    branch_id?: number;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
type OfferItemCreationAttributes = Optional<IOfferItem, "id">;
declare class OfferItem extends Model<IOfferItem, OfferItemCreationAttributes> implements IOfferItem {
    id: number;
    offer_id: number;
    item_id: number;
    branch_id?: number;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
}
export default OfferItem;
