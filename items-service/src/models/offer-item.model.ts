import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";
import Offer from "./offer.model";
import Item from "./item.model";

export interface IOfferItem {
  id: number;
  offer_id: number;
  item_id: number;
  branch_id?: number;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type OfferItemCreationAttributes = Optional<IOfferItem, "id">;

class OfferItem extends Model<IOfferItem, OfferItemCreationAttributes> implements IOfferItem {
  public id!: number;
  public offer_id!: number;
  public item_id!: number;
  public branch_id?: number;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;
}

OfferItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    offer_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: { model: "offers", key: "id" }
    },
    item_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: { model: "items", key: "id" }
    },
    branch_id: { type: DataTypes.INTEGER, allowNull: true },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "OfferItem",
    tableName: "offer_items",
    timestamps: true,
    paranoid: true,
  }
);

OfferItem.belongsTo(Offer, { foreignKey: "offer_id", as: "offer" });
Offer.hasMany(OfferItem, { foreignKey: "offer_id", as: "items" });

OfferItem.belongsTo(Item, { foreignKey: "item_id", as: "item" });
Item.hasMany(OfferItem, { foreignKey: "item_id", as: "offers" });

export default OfferItem;
