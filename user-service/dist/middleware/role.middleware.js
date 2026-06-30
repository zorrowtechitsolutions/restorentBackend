"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const checkPermission = (module, action) => async (req, res, next) => {
    try {
        const roleId = req.user?.role_id || req.user?.roleId;
        if (!roleId) {
            return res.status(403).json({
                message: "Permission denied: Role ID not found in user token",
            });
        }
        const response = await axios_1.default.post(`${process.env.ROLE_SERVICE_URL}/check-permission`, {
            roleId,
            module,
            action,
        }, {
            headers: {
                Authorization: req.headers.authorization,
            },
        });
        if (!response.data.allowed) {
            return res.status(403).json({
                message: "Permission denied",
            });
        }
        next();
    }
    catch (error) {
        console.error("🔥 Permission middleware error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        return res.status(error.response?.status || 500).json({
            message: "Permission check failed",
            error: error.response?.data || error.message,
        });
    }
};
exports.checkPermission = checkPermission;
//# sourceMappingURL=role.middleware.js.map