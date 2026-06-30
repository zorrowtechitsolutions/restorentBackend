import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";

export interface IPayroll {
  id: number;
  branch_id?: number;
  date: Date;
  employee_id: number; // Represent user_id from user-service assigned with an employee role
  amount: number;
  payment_choice: string;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type PayrollCreationAttributes = Optional<IPayroll, "id">;

class Payroll extends Model<IPayroll, PayrollCreationAttributes> implements IPayroll {
  public id!: number;
  public branch_id?: number;
  public date!: Date;
  public employee_id!: number; // Represent user_id from user-service assigned with an employee role
  public amount!: number;
  public payment_choice!: string;
}

Payroll.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    employee_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: "References user_id from user-service assigned with an employee role"
    },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_choice: { type: DataTypes.STRING, allowNull: false },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "Payroll",
    tableName: "payrolls",
    timestamps: true,
    paranoid: true,
  }
);

export default Payroll;
