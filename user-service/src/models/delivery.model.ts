import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";
import Order from "./order.model";

export interface IDelivery {
  id: number;
  order_id: number;
  distance_km?: number;
  delivery_rate_per_km?: number;
  calculated_delivery_charge?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type DeliveryCreationAttributes = Optional<IDelivery, "id">;

class Delivery extends Model<IDelivery, DeliveryCreationAttributes> implements IDelivery {
  public id!: number;
  public order_id!: number;
  public distance_km?: number;
  public delivery_rate_per_km?: number;
  public calculated_delivery_charge?: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  public static associate() {
    Delivery.belongsTo(Order, { foreignKey: "order_id", as: "order" });
  }
}

Delivery.init(
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
    distance_km: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    delivery_rate_per_km: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    calculated_delivery_charge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Delivery",
    tableName: "deliveries",
    timestamps: true,
  }
);

export default Delivery;
