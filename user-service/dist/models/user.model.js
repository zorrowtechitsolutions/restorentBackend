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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_role_model_1 = __importDefault(require("./user-role.model"));
const order_model_1 = __importDefault(require("./order.model"));
/* =======================
   MODEL CLASS
======================= */
class User extends Model {
    id;
    userId;
    name;
    email;
    image;
    phone;
    username;
    email_verified_at;
    password;
    fcm_token;
    branch_id;
    country_code;
    is_guest;
    status;
    balance;
    creator_type;
    creator_id;
    editor_type;
    editor_id;
    role_id;
    otp;
    otp_expiry;
    // Password Verification
    async comparePassword(password) {
        return bcryptjs_1.default.compare(password, this.password);
    }
    static associate() {
        User.belongsTo(user_role_model_1.default, { foreignKey: "role_id", as: "role" });
        User.hasMany(order_model_1.default, { foreignKey: "user_id", as: "orders" });
    }
}
/* =======================
   INIT MODEL
======================= */
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.VIRTUAL,
        get() {
            const id = this.getDataValue("id");
            if (!id)
                return null;
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
}, {
    sequelize: db_1.default,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    paranoid: true,
    hooks: {
        beforeSave: async (user) => {
            if (user.changed("password")) {
                const salt = await bcryptjs_1.default.genSalt(10);
                user.password = await bcryptjs_1.default.hash(user.password, salt);
            }
        },
    },
    indexes: [
        { fields: ["email"], unique: true },
        { fields: ["username"], unique: true },
        { fields: ["phone"], unique: true },
        { fields: ["role_id"] },
    ],
});
exports.default = User;
//# sourceMappingURL=user.model.js.map