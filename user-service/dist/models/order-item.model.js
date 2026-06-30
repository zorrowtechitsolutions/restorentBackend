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
const order_model_1 = __importDefault(require("./order.model"));
class OrderItem extends Model {
    id;
    order_id;
    branch_id;
    item_id;
    quantity;
    discount;
    tax_name;
    tax_rate;
    tax_amount;
    price;
    item_variations;
    item_extras;
    item_variation_total;
    item_extra_total;
    total_price;
    preparation_time;
    instruction;
    creator_type;
    creator_id;
    editor_type;
    editor_id;
    static associate() {
        OrderItem.belongsTo(order_model_1.default, { foreignKey: "order_id", as: "order" });
    }
}
OrderItem.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    tax_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tax_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    tax_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    item_variations: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    item_extras: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    item_variation_total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    item_extra_total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    preparation_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    instruction: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    modelName: "OrderItem",
    tableName: "order_items",
    timestamps: true,
});
exports.default = OrderItem;
//# sourceMappingURL=order-item.model.js.map