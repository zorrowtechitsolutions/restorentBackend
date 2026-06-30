import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";
import Item from "./item.model";
import ItemAttribute from "./item-attribute.model";

export interface IItemVariation {
  id: number;
  item_id: number;
  item_attribute_id: number;
  name: string;
  price: number;
  caution?: string;
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

type ItemVariationCreationAttributes = Optional<IItemVariation, "id" | "status">;

class ItemVariation extends Model<IItemVariation, ItemVariationCreationAttributes> implements IItemVariation {
  public id!: number;
  public item_id!: number;
  public item_attribute_id!: number;
  public name!: string;
  public price!: number;
  public caution?: string;
  public status!: number;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;
  public branch_id?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

ItemVariation.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    item_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: { model: "items", key: "id" }
    },
    item_attribute_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: { model: "item_attributes", key: "id" }
    },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    caution: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "ItemVariation",
    tableName: "item_variations",
    timestamps: true,
    paranoid: true,
  }
);

ItemVariation.belongsTo(Item, { foreignKey: "item_id", as: "item" });
Item.hasMany(ItemVariation, { foreignKey: "item_id", as: "variations" });

ItemVariation.belongsTo(ItemAttribute, { foreignKey: "item_attribute_id", as: "attribute" });
ItemAttribute.hasMany(ItemVariation, { foreignKey: "item_attribute_id", as: "variations" });

export default ItemVariation;
