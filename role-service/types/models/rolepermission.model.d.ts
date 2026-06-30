import { Model, Optional } from "sequelize";
interface IRolePermission {
    id: number;
    roleId: number;
    permissionId: number;
    hospitalId?: number;
    labId?: number;
    pharmacyId?: number;
}
interface RolePermissionCreation extends Optional<IRolePermission, "id"> {
}
declare class RolePermission extends Model<IRolePermission, RolePermissionCreation> implements IRolePermission {
    id: number;
    roleId: number;
    permissionId: number;
    hospitalId?: number;
    labId?: number;
    pharmacyId?: number;
}
export default RolePermission;
