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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const SequelizeModule = __importStar(require("sequelize"));
const { Sequelize } = SequelizeModule;
const env_1 = require("./env");
const isProduction = env_1.env.NODE_ENV === "production";
const sequelize = new Sequelize(env_1.env.DATABASE_URL, {
    dialect: "postgres",
    logging: isProduction ? false : console.log,
    dialectOptions: isProduction
        ? {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        }
        : {},
});
const connectDB = async () => {
    let attempts = 0;
    const maxAttempts = 5;
    let connected = false;
    while (!connected && attempts < maxAttempts) {
        try {
            await sequelize.authenticate();
            console.log("✅ PostgreSQL Connected (User Service)");
            connected = true;
            // Sync schema (Disabled for migrations)
            // await sequelize.sync({ alter: true });
        }
        catch (err) {
            attempts++;
            console.error(`❌ DB Connection failed (Attempt ${attempts}/${maxAttempts}):`, err);
            if (attempts < maxAttempts) {
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            else {
                process.exit(1);
            }
        }
    }
};
exports.connectDB = connectDB;
exports.default = sequelize;
//# sourceMappingURL=db.js.map