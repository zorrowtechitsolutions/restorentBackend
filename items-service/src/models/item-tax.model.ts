import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";

export interface IItemTax {
  id: number;
  name: string;
  code: string;
  tax_rate: number;
  type: string;  
  status: number;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  branch_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type ItemTaxCreationAttributes = Optional<IItemTax, "id" | "status">;

class ItemTax extends Model<IItemTax, ItemTaxCreationAttributes> implements IItemTax {
  public id!: number;
  public name!: string;
  public code!: string;
  public tax_rate!: number;
  public type!: string;
  public status!: number;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;
  public branch_id?: number;
}

ItemTax.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    tax_rate: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "ItemTax",
    tableName: "item_taxes",
    timestamps: true,
    paranoid: true,
  }
);

export default ItemTax;
