import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";
import User from "./user.model";

/* =======================
   INTERFACES
======================= */

export interface IUserRole {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

/* =======================
   CREATION ATTRIBUTES
======================= */

type UserRoleCreationAttributes = Optional<IUserRole, "id">;

/* =======================
   MODEL CLASS
======================= */

class UserRole extends Model<IUserRole, UserRoleCreationAttributes> implements IUserRole {
  public id!: number;
  public name!: string;

  public static associate() {
    UserRole.hasMany(User, { foreignKey: "role_id", as: "users" });
  }
}

/* =======================
   INIT MODEL
======================= */

UserRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "UserRole",
    tableName: "user_roles",
    timestamps: true,
    paranoid: true, // Enable soft delete
  }
);


export default UserRole;
