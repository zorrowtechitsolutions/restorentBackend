declare const Model: any;
import { Optional } from "sequelize";
export interface INotification {
    id: number;
    branchIds?: number[];
    userIds?: number[];
    role_ids?: number[];
    message: string;
    branchReadStatus?: object;
    userReadStatus?: object;
    createdAt?: Date;
    updatedAt?: Date;
}
type NotificationCreationAttributes = Optional<INotification, "id" | "branchIds" | "userIds" | "branchReadStatus" | "userReadStatus" | "createdAt" | "updatedAt">;
declare class Notification extends Model<INotification, NotificationCreationAttributes> implements INotification {
    id: number;
    branchIds?: number[];
    userIds?: number[];
    role_ids?: number[];
    message: string;
    branchReadStatus?: object;
    userReadStatus?: object;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Notification;
