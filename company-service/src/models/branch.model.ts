import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";

export interface IBranch {
  id: number;
  branch_virtual_id?: string;
  name: string;
  image?: string;
  email: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  location?: string;
  address?: string;
  status: number;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  license_code?: string;
  branch_id?: string;
  password?: string;
  otp?: string;
  otp_expiry?: Date;
  role_id?: number;
  fcm_token?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type BranchCreationAttributes = Optional<IBranch, "id" | "status" | "creator_type" | "creator_id" | "editor_type" | "editor_id" | "createdAt" | "updatedAt" | "deletedAt">;

class Branch extends Model<IBranch, BranchCreationAttributes> implements IBranch {
  public id!: number;
  public readonly branch_virtual_id!: string;
  public name!: string;
  public image?: string;
  public email!: string;
  public phone!: string;
  public latitude?: number;
  public longitude?: number;
  public radius?: number;
  public location?: string;
  public address?: string;
  public status!: number;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;
  public license_code?: string;
  public branch_id?: string;
  public password?: string;
  public otp?: string;
  public otp_expiry?: Date;
  public role_id?: number;
  public fcm_token?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Branch.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    branch_virtual_id: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("id");
        if (!id) return null;
        return `#BRN${String(id).padStart(5, "0")}`;
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    radius: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Allowed attendance radius in meters",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
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
    license_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    branch_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fcm_token: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: "Branch",
    tableName: "branches",
    timestamps: true,
    paranoid: true,
  }
);

export default Branch;
