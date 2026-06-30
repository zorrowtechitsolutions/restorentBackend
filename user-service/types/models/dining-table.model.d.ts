declare const Model: any;
import { Optional } from "sequelize";
export interface IDiningTable {
    id: number;
    name: string;
    slug: string;
    size: number;
    qr_code?: string;
    branch_id: number;
    status: number;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
type DiningTableCreationAttributes = Optional<IDiningTable, "id" | "qr_code" | "status" | "creator_type" | "creator_id" | "editor_type" | "editor_id">;
declare class DiningTable extends Model<IDiningTable, DiningTableCreationAttributes> implements IDiningTable {
    id: number;
    name: string;
    slug: string;
    size: number;
    qr_code?: string;
    branch_id: number;
    status: number;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    static associate(): void;
}
export default DiningTable;
