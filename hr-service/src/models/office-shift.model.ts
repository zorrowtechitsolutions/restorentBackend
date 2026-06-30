import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";

export interface IOfficeShift {
  id: number;
  name: string;
  branch_id: number;
  monday_in?: string;
  monday_out?: string;
  tuesday_in?: string;
  tuesday_out?: string;
  wednesday_in?: string;
  wednesday_out?: string;
  thursday_in?: string;
  thursday_out?: string;
  friday_in?: string;
  friday_out?: string;
  saturday_in?: string;
  saturday_out?: string;
  sunday_in?: string;
  sunday_out?: string;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type OfficeShiftCreationAttributes = Optional<IOfficeShift, "id">;

class OfficeShift extends Model<IOfficeShift, OfficeShiftCreationAttributes> implements IOfficeShift {
  public id!: number;
  public name!: string;
  public branch_id!: number;
  public monday_in?: string;
  public monday_out?: string;
}

OfficeShift.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    branch_id: { type: DataTypes.INTEGER, allowNull: false },
    monday_in: { type: DataTypes.STRING, allowNull: true },
    monday_out: { type: DataTypes.STRING, allowNull: true },
    tuesday_in: { type: DataTypes.STRING, allowNull: true },
    tuesday_out: { type: DataTypes.STRING, allowNull: true },
    wednesday_in: { type: DataTypes.STRING, allowNull: true },
    wednesday_out: { type: DataTypes.STRING, allowNull: true },
    thursday_in: { type: DataTypes.STRING, allowNull: true },
    thursday_out: { type: DataTypes.STRING, allowNull: true },
    friday_in: { type: DataTypes.STRING, allowNull: true },
    friday_out: { type: DataTypes.STRING, allowNull: true },
    saturday_in: { type: DataTypes.STRING, allowNull: true },
    saturday_out: { type: DataTypes.STRING, allowNull: true },
    sunday_in: { type: DataTypes.STRING, allowNull: true },
    sunday_out: { type: DataTypes.STRING, allowNull: true },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "OfficeShift",
    tableName: "office_shifts",
    timestamps: true,
    paranoid: true,
  }
);

export default OfficeShift;
