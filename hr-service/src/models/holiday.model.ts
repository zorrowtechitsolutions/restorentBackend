import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";

export interface IHoliday {
  id: number;
  branch_id: number;
  title: string;
  start_date: Date;
  end_date: Date;
  details?: string;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type HolidayCreationAttributes = Optional<IHoliday, "id">;

class Holiday extends Model<IHoliday, HolidayCreationAttributes> implements IHoliday {
  public id!: number;
  public branch_id!: number;
  public title!: string;
  public start_date!: Date;
  public end_date!: Date;
  public details?: string;
}

Holiday.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    details: { type: DataTypes.TEXT, allowNull: true },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "Holiday",
    tableName: "holidays",
    timestamps: true,
    paranoid: true,
  }
);

export default Holiday;
