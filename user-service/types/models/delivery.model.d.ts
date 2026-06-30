declare const Model: any;
import { Optional } from "sequelize";
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
declare class Delivery extends Model<IDelivery, DeliveryCreationAttributes> implements IDelivery {
    id: number;
    order_id: number;
    distance_km?: number;
    delivery_rate_per_km?: number;
    calculated_delivery_charge?: number;
    createdAt?: Date;
    updatedAt?: Date;
    static associate(): void;
}
export default Delivery;
