import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";

export interface ILeaveType {
  id: number;
  title: string;
  branch_id: number;
}

type LeaveTypeCreationAttributes = Optional<ILeaveType, "id">;

class LeaveType extends Model<ILeaveType, LeaveTypeCreationAttributes> implements ILeaveType {
  public id!: number;
  public title!: string;
  public branch_id!: number;
}

LeaveType.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    branch_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "LeaveType",
    tableName: "leave_types",
    timestamps: true,
  }
);

export default LeaveType;
