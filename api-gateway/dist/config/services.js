"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICES = void 0;
const env_1 = require("./env");
exports.SERVICES = {
    USER_SERVICE: env_1.env.USER_SERVICE_URL,
    COMPANY_SERVICE: env_1.env.COMPANY_SERVICE_URL,
    ITEMS_SERVICE: env_1.env.ITEMS_SERVICE_URL,
    ROLE_SERVICE: env_1.env.ROLE_SERVICE_URL,
    HR_SERVICE: env_1.env.HR_SERVICE_URL,
};
if (!exports.SERVICES.USER_SERVICE) {
    throw new Error("USER_SERVICE_URL not defined");
}
if (!exports.SERVICES.COMPANY_SERVICE) {
    throw new Error("COMPANY_SERVICE_URL not defined");
}
if (!exports.SERVICES.ITEMS_SERVICE) {
    throw new Error("ITEMS_SERVICE_URL not defined");
}
if (!exports.SERVICES.ROLE_SERVICE) {
    throw new Error("ROLE_SERVICE_URL not defined");
}
if (!exports.SERVICES.HR_SERVICE) {
    throw new Error("HR_SERVICE_URL not defined");
}
