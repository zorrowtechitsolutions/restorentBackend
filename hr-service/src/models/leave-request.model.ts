import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";
import LeaveType from "./leave-type.model";

export interface ILeaveRequest {
  id: number;
  branch_id: number;
  employee_name: string;
  emp_id: number; // Represent user_id from user-service assigned with an employee role
  leave_type_id: number;
  start_date: Date;
  end_date: Date;
  status: string; // pending, approved, rejected             
  attachment?: string;
  leave_reason?: string;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type LeaveRequestCreationAttributes = Optional<ILeaveRequest, "id" | "status">;

class LeaveRequest extends Model<ILeaveRequest, LeaveRequestCreationAttributes> implements ILeaveRequest {
  public id!: number;
  public branch_id!: number;
  public employee_name!: string;
  public emp_id!: number; // Represent user_id from user-service assigned with an employee role
  public leave_type_id!: number;
  public start_date!: Date;
  public end_date!: Date;
  public status!: string;
  public attachment?: string;
  public leave_reason?: string;
}

LeaveRequest.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: false },
    employee_name: { type: DataTypes.STRING, allowNull: false },
    emp_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: "References user_id from user-service assigned with an employee role"
    },
    leave_type_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: { model: "leave_types", key: "id" }
    },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM("pending", "approved", "rejected"), defaultValue: "pending" },
    attachment: { type: DataTypes.STRING, allowNull: true },
    leave_reason: { type: DataTypes.TEXT, allowNull: true },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "LeaveRequest",
    tableName: "leave_requests",
    timestamps: true,
    paranoid: true,
  }
);

LeaveRequest.belongsTo(LeaveType, { foreignKey: "leave_type_id", as: "leaveType" });

export default LeaveRequest;
