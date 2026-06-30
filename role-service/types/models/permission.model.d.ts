import { Model } from "sequelize";
interface IPermission {
    id: number;
    module: string;
    action: string;
}
declare class Permission extends Model<IPermission> implements IPermission {
    id: number;
    module: string;
    action: string;
}
export default Permission;
