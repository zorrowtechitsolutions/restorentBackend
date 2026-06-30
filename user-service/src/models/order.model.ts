import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";
import User from "./user.model";
import DiningTable from "./dining-table.model";
import OrderItem from "./order-item.model";
import Delivery from "./delivery.model";

export interface IOrder {
  id: number;
  order_serial_no?: string;
  order_mode?: string;
  token?: string;
  user_id: number;
  branch_id: number;
  subtotal: number;
  discount: number;
  delivery_charge: number;
  total_tax: number;
  total: number;
  order_type: number; // e.g. 1: Dining, 2: Takeaway
  order_date_time: Date;
  delivery_time?: Date;
  preparation_time?: number; // in minutes
  is_advance_order: boolean;
  pos_received_amount?: number;
  pos_payment_method?: number;
  payment_status: string; // 'paid' | 'unpaid'
  status: string; // 'accept' | 'preparing' | 'prepared' | 'delivered'
  dining_table_id?: number;
  delivery_boy_id?: number;
  reason?: string;
  source: number; // 1: Web, 2: App, 3: POS
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type OrderCreationAttributes = Optional<
  IOrder,
  | "id"
  | "order_serial_no"
  | "token"
  | "delivery_time"
  | "preparation_time"
  | "pos_received_amount"
  | "pos_payment_method"
  | "dining_table_id"
  | "delivery_boy_id"
  | "reason"
  | "creator_type"
  | "creator_id"
  | "editor_type"
  | "editor_id"
>;

class Order extends Model<IOrder, OrderCreationAttributes> implements IOrder {
  public id!: number;
  public order_serial_no?: string;
  public token?: string;
  public user_id!: number;
  public branch_id!: number;
  public subtotal!: number;
  public discount!: number;
  public delivery_charge!: number;
  public total_tax!: number;
  public total!: number;
  public order_type!: number;
  public order_date_time!: Date;
  public delivery_time?: Date;
  public preparation_time?: number;
  public is_advance_order!: boolean;
  public pos_received_amount?: number;
  public pos_payment_method?: number;
  public payment_status!: string;
  public status!: string;
  public dining_table_id?: number;
  public delivery_boy_id?: number;
  public reason?: string;
  public source!: number;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;

  public static associate() {
    Order.belongsTo(User, { foreignKey: "user_id", as: "user" });
    Order.belongsTo(User, { foreignKey: "delivery_boy_id", as: "deliveryBoy" });
    Order.belongsTo(DiningTable, { foreignKey: "dining_table_id", as: "diningTable" });
    Order.hasMany(OrderItem, { foreignKey: "order_id", as: "orderItems" });                                              
    Order.hasOne(Delivery, { foreignKey: "order_id", as: "delivery" });
  }
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_serial_no: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("id");
        if (!id) return null;
        return `#ORD${String(id).padStart(5, "0")}`;
      },
    },
    order_mode: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue("dining_table_id") ? "Dining Table" : "Takeaway";
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    delivery_charge: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total_tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    order_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_date_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    delivery_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    preparation_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_advance_order: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pos_received_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    pos_payment_method: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.ENUM('paid', 'unpaid'),
      defaultValue: 'unpaid',
    },
    status: {
      type: DataTypes.ENUM('accept', 'preparing', 'prepared', 'delivered'),
      defaultValue: 'accept',
    },
    dining_table_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    delivery_boy_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "References users.id — a user assigned the delivery boy role",
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    source: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: "Order",
    tableName: "orders",
    timestamps: true,
  }
);


export default Order;

