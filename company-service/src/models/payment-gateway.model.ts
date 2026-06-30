import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";
import Branch from "./branch.model";

export interface IPaymentGateway {
  id: number;
  branch_id: number;
  upi_id?: string;
  gpay_no?: string;
  qr_code?: string;
  status: number;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type PaymentGatewayCreationAttributes = Optional<IPaymentGateway, "id" | "status" | "creator_type" | "creator_id" | "editor_type" | "editor_id" | "createdAt" | "updatedAt" | "deletedAt">;

class PaymentGateway extends Model<IPaymentGateway, PaymentGatewayCreationAttributes> implements IPaymentGateway {
  public id!: number;
  public branch_id!: number;
  public upi_id?: string;
  public gpay_no?: string;
  public qr_code?: string;
  public status!: number;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

PaymentGateway.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "branches",
        key: "id",
      },
    },
    upi_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gpay_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qr_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // 1: Active, 0: Inactive
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
    modelName: "PaymentGateway",
    tableName: "payment_gateways",
    timestamps: true,
    paranoid: true,
  }
);

PaymentGateway.belongsTo(Branch, { foreignKey: "branch_id", as: "branch" });
Branch.hasMany(PaymentGateway, { foreignKey: "branch_id", as: "payment_gateways" });

export default PaymentGateway;
