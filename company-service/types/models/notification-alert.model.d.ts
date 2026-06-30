declare const Model: any;
import { Optional } from "sequelize";
export interface INotificationAlert {
    id: number;
    branch_id: number;
    name: string;
    mail_message?: string;
    sms_message?: string;
    push_notification_message?: string;
    mail: boolean;
    sms: boolean;
    push_notification: boolean;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
type NotificationAlertCreationAttributes = Optional<INotificationAlert, "id" | "mail" | "sms" | "push_notification" | "creator_type" | "creator_id" | "editor_type" | "editor_id" | "createdAt" | "updatedAt" | "deletedAt">;
declare class NotificationAlert extends Model<INotificationAlert, NotificationAlertCreationAttributes> implements INotificationAlert {
    id: number;
    branch_id: number;
    name: string;
    mail_message?: string;
    sms_message?: string;
    push_notification_message?: string;
    mail: boolean;
    sms: boolean;
    push_notification: boolean;
    creator_type?: string;
    creator_id?: number;
    editor_type?: string;
    editor_id?: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date;
}
export default NotificationAlert;
