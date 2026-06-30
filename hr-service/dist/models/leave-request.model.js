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
const leave_type_model_1 = __importDefault(require("./leave-type.model"));
class LeaveRequest extends Model {
    id;
    branch_id;
    employee_name;
    emp_id; // Represent user_id from user-service assigned with an employee role
    leave_type_id;
    start_date;
    end_date;
    status;
    attachment;
    leave_reason;
}
LeaveRequest.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: false },
    employee_name: { type: DataTypes.STRING, allowNull: false },
    emp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "References user_id from user-service assigned with an employee role"
    },
    leave_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "leave_types", key: "id" }
    },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM("pending", "approved", "rejected"), defaultValue: "pending" },
    attachment: { type: DataTypes.STRING, allowNull: true },
    leave_reason: { type: DataTypes.TEXT, allowNull: true },
    creator_type: { type: DataTypes.STRING, allowNull: true },
    creator_id: { type: DataTypes.INTEGER, allowNull: true },
    editor_type: { type: DataTypes.STRING, allowNull: true },
    editor_id: { type: DataTypes.INTEGER, allowNull: true },
}, {
    sequelize: db_1.default,
    modelName: "LeaveRequest",
    tableName: "leave_requests",
    timestamps: true,
    paranoid: true,
});
LeaveRequest.belongsTo(leave_type_model_1.default, { foreignKey: "leave_type_id", as: "leaveType" });
exports.default = LeaveRequest;
//# sourceMappingURL=leave-request.model.js.map