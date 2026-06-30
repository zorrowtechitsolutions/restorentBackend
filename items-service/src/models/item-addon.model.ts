import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";
import Item from "./item.model";

export interface IItemAddon {
  id: number;
  item_id: number;
  addon_item_id: number;
  addon_item_variation?: string;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  branch_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type ItemAddonCreationAttributes = Optional<IItemAddon, "id">;

class ItemAddon extends Model<IItemAddon, ItemAddonCreationAttributes> implements IItemAddon {
  public id!: number;
  public item_id!: number;
  public addon_item_id!: number;
  public addon_item_variation?: string;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;
  public branch_id?: number;
}

ItemAddon.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    item_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: { model: "items", key: "id" }
    },
    addon_item_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: { model: "items", key: "id" }
    },
    addon_item_variation: { type: DataTypes.STRING, allowNull: true },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "ItemAddon",
    tableName: "item_addons",
    timestamps: true,
    paranoid: true,
  }
);

ItemAddon.belongsTo(Item, { foreignKey: "item_id", as: "item" });
Item.hasMany(ItemAddon, { foreignKey: "item_id", as: "addons" });

ItemAddon.belongsTo(Item, { foreignKey: "addon_item_id", as: "addonItem" });

export default ItemAddon;
