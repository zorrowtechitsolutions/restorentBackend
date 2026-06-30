import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";
import bcrypt from "bcryptjs";
import UserRole from "./user-role.model";
import Order from "./order.model";

/* =======================
   INTERFACES
======================= */

export interface IUser {
  id: number;
  userId?: string;         // Virtual ID
  name: string;
  email: string;
  image?: string;
  phone: string;
  username: string;
  email_verified_at?: Date;
  password?: string;
  fcm_token?: string;
  branch_id?: number;
  country_code?: string;
  is_guest: boolean;
  status: number;          // 0: Inactive, 1: Active
  balance: number;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  role_id: number;         // Link to Role table
  otp?: string;
  otp_expiry?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

/* =======================
   CREATION ATTRIBUTES
======================= */

type UserCreationAttributes = Optional<
  IUser,
  | "id"
  | "userId"
  | "image"
  | "email_verified_at"
  | "fcm_token"
  | "branch_id"
  | "country_code"
  | "is_guest"
  | "status"
  | "balance"
  | "creator_type"
  | "creator_id"
  | "editor_type"
  | "editor_id"
  | "deletedAt"
>;

/* =======================
   MODEL CLASS
======================= */

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: number;
  public readonly userId!: string;
  public name!: string;
  public email!: string;
  public image?: string;
  public phone!: string;
  public username!: string;
  public email_verified_at?: Date;
  public password!: string;
  public fcm_token?: string;
  public branch_id?: number;
  public country_code?: string;
  public is_guest!: boolean;
  public status!: number;
  public balance!: number;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;
  public role_id!: number;
  public otp?: string;
  public otp_expiry?: Date;

  // Password Verification
  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public static associate() {
    User.belongsTo(UserRole, { foreignKey: "role_id", as: "role" });
    User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
  }
}

/* =======================
   INIT MODEL
======================= */

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("id");
        if (!id) return null;
        return `#USR${String(id).padStart(5, "0")}`;
      },
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fcm_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    country_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_guest: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // 1 for active
    },

    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
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

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user_roles",
        key: "id",
      },
    },

    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    otp_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeSave: async (user: User) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    indexes: [
      { fields: ["email"], unique: true },
      { fields: ["username"], unique: true },
      { fields: ["phone"], unique: true },
      { fields: ["role_id"] },
    ],
  }
);


export default User;
