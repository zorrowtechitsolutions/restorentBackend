import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";
import Branch from "./branch.model";

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

class NotificationAlert extends Model<INotificationAlert, NotificationAlertCreationAttributes> implements INotificationAlert {
  public id!: number;
  public branch_id!: number;
  public name!: string;
  public mail_message?: string;
  public sms_message?: string;
  public push_notification_message?: string;
  public mail!: boolean;
  public sms!: boolean;
  public push_notification!: boolean;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

NotificationAlert.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "branches",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mail_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sms_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    push_notification_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sms: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    push_notification: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    creator_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    editor_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    editor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "NotificationAlert",
    tableName: "notification_alerts",
    timestamps: true,
    paranoid: true,
  }
);

NotificationAlert.belongsTo(Branch, { foreignKey: "branch_id", as: "branch" });
Branch.hasMany(NotificationAlert, { foreignKey: "branch_id", as: "notification_alerts" });

export default NotificationAlert;
