import { Model, Optional } from "sequelize";
interface IRole {
    id: number;
    name: string;
    description?: string;
    hospitalId?: number;
    labId?: number;
    pharmacyId?: number;
    isActive: boolean;
}
interface RoleCreation extends Optional<IRole, "id"> {
}
declare class Role extends Model<IRole, RoleCreation> implements IRole {
    id: number;
    name: string;
    description?: string;
    hospitalId?: number;
    labId?: number;
    isActive: boolean;
    pharmacyId?: number;
}
export default Role;
