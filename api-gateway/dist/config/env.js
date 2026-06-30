"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production"]).default("development"),
    PORT: zod_1.z.string().default("3000"),
    USER_SERVICE_URL: zod_1.z.string().min(1),
    COMPANY_SERVICE_URL: zod_1.z.string().min(1),
    ITEMS_SERVICE_URL: zod_1.z.string().min(1),
    ROLE_SERVICE_URL: zod_1.z.string().min(1),
    HR_SERVICE_URL: zod_1.z.string().min(1),
    JWT_SECRET: zod_1.z.string().min(10),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment variables in API Gateway:");
    console.error(parsed.error.format());
    process.exit(1);
}
exports.env = parsed.data;
