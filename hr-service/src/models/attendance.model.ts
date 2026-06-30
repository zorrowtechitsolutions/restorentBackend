import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";

export interface IAttendance {
  id: number;
  branch_id: number;
  emp_id: number; // Represent user_id from user-service assigned with an employee role
  type: string; // "check-in" | "check-out"
  timestamp: Date;
  latitude?: number;
  longitude?: number;
  selfie_url?: string;
  status?: string;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type AttendanceCreationAttributes = Optional<IAttendance, "id">;

class Attendance extends Model<IAttendance, AttendanceCreationAttributes> implements IAttendance {
  public id!: number;
  public branch_id!: number;
  public emp_id!: number; // Represent user_id from user-service assigned with an employee role
  public type!: string;
  public timestamp!: Date;
  public latitude?: number;
  public longitude?: number;
  public selfie_url?: string;
  public status?: string;
}

Attendance.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: false },
    emp_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: "References user_id from user-service assigned with an employee role"
    },
    type: { type: DataTypes.STRING, allowNull: false },
    timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
    selfie_url: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: true },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "Attendance",
    tableName: "attendances",
    timestamps: true,
    paranoid: true,
  }
);

export default Attendance;
