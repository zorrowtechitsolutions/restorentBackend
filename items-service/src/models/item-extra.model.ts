import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";
import Item from "./item.model";

export interface IItemExtra {
  id: number;
  name: string;
  item_id: number;
  price: number;
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

type ItemExtraCreationAttributes = Optional<IItemExtra, "id" | "status">;

class ItemExtra extends Model<IItemExtra, ItemExtraCreationAttributes> implements IItemExtra {
  public id!: number;
  public name!: string;
  public item_id!: number;
  public price!: number;
  public status!: number;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;
  public branch_id?: number;
}

ItemExtra.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    item_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: { model: "items", key: "id" }
    },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "ItemExtra",
    tableName: "item_extras",
    timestamps: true,
    paranoid: true,
  }
);

ItemExtra.belongsTo(Item, { foreignKey: "item_id", as: "item" });
Item.hasMany(ItemExtra, { foreignKey: "item_id", as: "extras" });

export default ItemExtra;
