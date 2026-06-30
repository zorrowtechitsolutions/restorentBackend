declare const Model: any;
import { Optional } from "sequelize";
export interface IRole {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
type RoleCreationAttributes = Optional<IRole, "id">;
declare class Role extends Model<IRole, RoleCreationAttributes> implements IRole {
    id: number;
    name: string;
    static associate(): void;
}
export default Role;
