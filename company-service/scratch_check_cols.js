"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./src/config/db"));
async function checkCols() {
    try {
        const [results] = await db_1.default.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'notifications'");
        console.log("Actual Columns in notifications table:", results.map((r) => r.column_name));
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkCols();
