import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";
import Order from "./order.model";

export interface IDiningTable {
  id: number;
  name: string;
  slug: string;
  size: number;
  qr_code?: string;
  branch_id: number;
  status: number; // 0: Inactive, 1: Active
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type DiningTableCreationAttributes = Optional<IDiningTable, "id" | "qr_code" | "status" | "creator_type" | "creator_id" | "editor_type" | "editor_id">;

class DiningTable extends Model<IDiningTable, DiningTableCreationAttributes> implements IDiningTable {
  public id!: number;
  public name!: string;
  public slug!: string;
  public size!: number;
  public qr_code?: string;
  public branch_id!: number;
  public status!: number;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;

  public static associate() {
    DiningTable.hasMany(Order, { foreignKey: "dining_table_id", as: "orders" });
  }
}

DiningTable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qr_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
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
    modelName: "DiningTable",
    tableName: "dining_tables",
    timestamps: true,
    hooks: {
      afterCreate: async (table: any) => {
        const qrContent = `https://foodscan.app/menu?branch_id=${table.branch_id}&table_id=${table.id}`;
        table.qr_code = qrContent;
        await table.save();
      },
    }
  }
);


export default DiningTable;
