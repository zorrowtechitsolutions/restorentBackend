"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SequelizeModule = __importStar(require("sequelize"));
const { Model, DataTypes } = SequelizeModule;
const db_1 = __importDefault(require("../config/db"));
const user_model_1 = __importDefault(require("./user.model"));
const dining_table_model_1 = __importDefault(require("./dining-table.model"));
const order_item_model_1 = __importDefault(require("./order-item.model"));
const delivery_model_1 = __importDefault(require("./delivery.model"));
class Order extends Model {
    id;
    order_serial_no;
    token;
    user_id;
    branch_id;
    subtotal;
    discount;
    delivery_charge;
    total_tax;
    total;
    order_type;
    order_date_time;
    delivery_time;
    preparation_time;
    is_advance_order;
    pos_received_amount;
    pos_payment_method;
    payment_status;
    status;
    dining_table_id;
    delivery_boy_id;
    reason;
    source;
    creator_type;
    creator_id;
    editor_type;
    editor_id;
    static associate() {
        Order.belongsTo(user_model_1.default, { foreignKey: "user_id", as: "user" });
        Order.belongsTo(user_model_1.default, { foreignKey: "delivery_boy_id", as: "deliveryBoy" });
        Order.belongsTo(dining_table_model_1.default, { foreignKey: "dining_table_id", as: "diningTable" });
        Order.hasMany(order_item_model_1.default, { foreignKey: "order_id", as: "orderItems" });
        Order.hasOne(delivery_model_1.default, { foreignKey: "order_id", as: "delivery" });
    }
}
Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    order_serial_no: {
        type: DataTypes.VIRTUAL,
        get() {
            const id = this.getDataValue("id");
            if (!id)
                return null;
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
}, {
    sequelize: db_1.default,
    modelName: "Order",
    tableName: "orders",
    timestamps: true,
});
exports.default = Order;
//# sourceMappingURL=order.model.js.map