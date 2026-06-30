import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";

export interface INotification {
  id: number;
  branchIds?: number[];
  administratorIds?: number[];
  customerIds?: number[];
  employeeIds?: number[];
  waiterIds?: number[];
  chefIds?: number[];
  staffIds?: number[];
  superAdminIds?: number[];
  message: string;
  branchReadStatus?: object;
  administratorReadStatus?: object;
  customerReadStatus?: object;
  employeeReadStatus?: object;
  waiterReadStatus?: object;
  chefReadStatus?: object;
  staffReadStatus?: object;
  superAdminReadStatus?: object;
  createdAt?: Date;
  updatedAt?: Date;
}

type NotificationCreationAttributes = Optional<
  INotification,
  "id" | "branchIds" | "administratorIds" | "customerIds" | "employeeIds" | "waiterIds" | "chefIds" | "staffIds" | "superAdminIds" | "branchReadStatus" | "administratorReadStatus" | "customerReadStatus" | "employeeReadStatus" | "waiterReadStatus" | "chefReadStatus" | "staffReadStatus" | "superAdminReadStatus" | "createdAt" | "updatedAt"
>;

class Notification extends Model<INotification, NotificationCreationAttributes> implements INotification {
  public id!: number;
  public branchIds?: number[];
  public administratorIds?: number[];
  public customerIds?: number[];
  public employeeIds?: number[];
  public waiterIds?: number[];
  public chefIds?: number[];
  public staffIds?: number[];
  public superAdminIds?: number[];
  public message!: string;
  public branchReadStatus?: object;
  public administratorReadStatus?: object;
  public customerReadStatus?: object;
  public employeeReadStatus?: object;
  public waiterReadStatus?: object;
  public chefReadStatus?: object;
  public staffReadStatus?: object;
  public superAdminReadStatus?: object;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    branchIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    administratorIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    customerIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    employeeIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    waiterIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    chefIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    staffIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    superAdminIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    branchReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    administratorReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    customerReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    employeeReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    waiterReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    chefReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    staffReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    superAdminReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
    timestamps: true,
  }
);

export default Notification;
