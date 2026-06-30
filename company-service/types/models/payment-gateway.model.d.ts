declare const Model: any;
import { Optional } from "sequelize";
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
declare class PaymentGateway extends Model<IPaymentGateway, PaymentGatewayCreationAttributes> implements IPaymentGateway {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date;
}
export default PaymentGateway;
