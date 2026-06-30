import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";

export interface IItemAttribute {
  id: number;
  name: string;
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

type ItemAttributeCreationAttributes = Optional<IItemAttribute, "id" | "status">;

class ItemAttribute extends Model<IItemAttribute, ItemAttributeCreationAttributes> implements IItemAttribute {
  public id!: number;
  public name!: string;
  public status!: number;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;
  public branch_id?: number;
}

ItemAttribute.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "ItemAttribute",
    tableName: "item_attributes",
    timestamps: true,
    paranoid: true,
  }
);

export default ItemAttribute;
