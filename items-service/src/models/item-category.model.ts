import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";

export interface IItemCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: number;
  sort: number;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  branch_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type ItemCategoryCreationAttributes = Optional<IItemCategory, "id" | "status" | "sort">;

class ItemCategory extends Model<IItemCategory, ItemCategoryCreationAttributes> implements IItemCategory {
  public id!: number;
  public name!: string;
  public slug!: string;
  public description?: string;
  public status!: number;
  public sort!: number;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;
  public branch_id?: number;
}

ItemCategory.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    sort: { type: DataTypes.INTEGER, defaultValue: 0 },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "ItemCategory",
    tableName: "item_categories",
    timestamps: true,
    paranoid: true,
  }
);

export default ItemCategory;
