import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";
import Order from "./order.model";

export interface IOrderItem {
  id: number;
  order_id: number;
  branch_id: number;
  item_id: number;
  quantity: number;
  discount: number;
  tax_name: string;
  tax_rate: number;
  tax_amount: number;
  price: number;
  item_variations?: object; // JSON array of variations
  item_extras?: object; // JSON array of extras
  item_variation_total: number;
  item_extra_total: number;
  total_price: number;
  preparation_time?: number; // in minutes
  instruction?: string;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type OrderItemCreationAttributes = Optional<
  IOrderItem,
  "id" | "discount" | "item_variations" | "item_extras" | "instruction" | "creator_type" | "creator_id" | "editor_type" | "editor_id" | "preparation_time"
>;

class OrderItem extends Model<IOrderItem, OrderItemCreationAttributes> implements IOrderItem {
  public id!: number;
  public order_id!: number;
  public branch_id!: number;
  public item_id!: number;
  public quantity!: number;
  public discount!: number;
  public tax_name!: string;
  public tax_rate!: number;
  public tax_amount!: number;
  public price!: number;
  public item_variations?: object;
  public item_extras?: object;
  public item_variation_total!: number;
  public item_extra_total!: number;
  public total_price!: number;
  public preparation_time?: number;
  public instruction?: string;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;

  public static associate() {
    OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });
  }
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    tax_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tax_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    item_variations: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    item_extras: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    item_variation_total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    item_extra_total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    preparation_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    instruction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    creator_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    editor_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    editor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "OrderItem",
    tableName: "order_items",
    timestamps: true,
  }
);



export default OrderItem;
