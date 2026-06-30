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
class DiningTable extends Model {
    id;
    name;
    slug;
    size;
    qr_code;
    branch_id;
    status;
    creator_type;
    creator_id;
    editor_type;
    editor_id;
    static associate() {
        DiningTable.hasMany(order_model_1.default, { foreignKey: "dining_table_id", as: "orders" });
    }
}
DiningTable.init({
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
}, {
    sequelize: db_1.default,
    modelName: "DiningTable",
    tableName: "dining_tables",
    timestamps: true,
    hooks: {
        afterCreate: async (table) => {
            const qrContent = `https://foodscan.app/menu?branch_id=${table.branch_id}&table_id=${table.id}`;
            table.qr_code = qrContent;
            await table.save();
        },
    }
});
exports.default = DiningTable;
//# sourceMappingURL=dining-table.model.js.map