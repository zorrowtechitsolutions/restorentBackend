import * as SequelizeModule from "sequelize";
const { Model, DataTypes } = SequelizeModule as any;
import { Optional } from "sequelize";
import sequelize from "../config/db";

export interface IOffer {
  id: number;
  name: string;
  slug: string;
  amount: number;
  image?: string;
  status: number;
  start_date: Date;
  end_date: Date;
  branch_id?: number;
  creator_type?: string;
  creator_id?: number;
  editor_type?: string;
  editor_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type OfferCreationAttributes = Optional<IOffer, "id" | "status">;

class Offer extends Model<IOffer, OfferCreationAttributes> implements IOffer {
  public id!: number;
  public name!: string;
  public slug!: string;
  public amount!: number;
  public image?: string;
  public status!: number;
  public start_date!: Date;
  public end_date!: Date;
  public branch_id?: number;
  public creator_type?: string;
  public creator_id?: number;
  public editor_type?: string;
  public editor_id?: number;
}

Offer.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: false },
    branch_id: { type: DataTypes.INTEGER, allowNull: true },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "Offer",
    tableName: "offers",
    timestamps: true,
    paranoid: true,
  }
);

export default Offer;
