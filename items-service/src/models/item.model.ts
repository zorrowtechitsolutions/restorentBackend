import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";
import ItemCategory from "./item-category.model";
import ItemTax from "./item-tax.model";

export interface IItem {
  id: number;
  item_category_id: number;
  tax_id?: number;
  name: string;
  slug: string;
  image?: string;
  caution?: string;
  description?: string;
  price: number;
  status: number;
  item_type: string;
  order: number;
  is_featured: boolean;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  branch_id?: number;
  preparation_time?: number; // in minutes
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type ItemCreationAttributes = Optional<IItem, "id" | "status" | "order" | "is_featured" | "preparation_time">;

class Item extends Model<IItem, ItemCreationAttributes> implements IItem {
  public id!: number;
  public item_category_id!: number;
  public tax_id?: number;
  public name!: string;
  public slug!: string
  public image?: string;
  public caution?: string;
  public description?: string;
  public price!: number;
  public status!: number;
  public item_type!: string;
  public order!: number;
  public is_featured!: boolean;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;
  public branch_id?: number;
  public preparation_time?: number;
}

Item.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    item_category_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: { model: "item_categories", key: "id" }
    },
    tax_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
        references: { model: "item_taxes", key: "id" }
    },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    image: { type: DataTypes.STRING, allowNull: true },
    caution: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    item_type: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    preparation_time: { type: DataTypes.INTEGER, allowNull: true },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "Item",
    tableName: "items",
    timestamps: true,
    paranoid: true,
  }
);

Item.belongsTo(ItemCategory, { foreignKey: "item_category_id", as: "category" });
ItemCategory.hasMany(Item, { foreignKey: "item_category_id", as: "items" });

Item.belongsTo(ItemTax, { foreignKey: "tax_id", as: "tax" });
ItemTax.hasMany(Item, { foreignKey: "tax_id", as: "items" });

export default Item;
