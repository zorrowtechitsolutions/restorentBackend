declare const Model: any;
import { Optional } from "sequelize";
export interface IOffer {
    id: number;
    name: string;
    slug: string;
    amount: number;
    image?: string;
    status: number;
    start_date: Date;
    end_date: Date;
    branch_id?: number;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
type OfferCreationAttributes = Optional<IOffer, "id" | "status">;
declare class Offer extends Model<IOffer, OfferCreationAttributes> implements IOffer {
    id: number;
    name: string;
    slug: string;
    amount: number;
    image?: string;
    status: number;
    start_date: Date;
    end_date: Date;
    branch_id?: number;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
}
export default Offer;
