declare const Model: any;
import { Optional } from "sequelize";
export interface IUserRole {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
type UserRoleCreationAttributes = Optional<IUserRole, "id">;
declare class UserRole extends Model<IUserRole, UserRoleCreationAttributes> implements IUserRole {
    id: number;
    name: string;
    static associate(): void;
}
export default UserRole;
