"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordEmail = exports.verifyOtpEmail = exports.sendOtpEmail = exports.verifyOtp = exports.loginWithPhone = exports.logout = exports.refreshUserToken = exports.resetPassword = exports.changePassword = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_service_1 = require("../services/user.service");
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_service_1 = require("../services/jwt.service");
const env_1 = require("../config/env");
const publisher_1 = require("../events/publisher");
// ─── Helper: Set Refresh Token Cookie ──────────────────────
const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
        path: "/",
    });
};
// ─── REGISTER ──────────────────────────────────────────────
exports.registerUser = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const data = await user_service_1.userService.register(req.body);
        try {
            await (0, publisher_1.publishEvent)("user_events", "USER_REGISTERED", {
                userId: data.user.id,
                roleId: data.user.role_id,
                branchId: data.user.branch_id,
            });
        }
        catch (err) {
            console.error("Failed to publish USER_REGISTERED event:", { error: err.message });
        }
        res.status(201).json({ success: true, message: "User registered successfully", data });
    }
    catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message || "Server Error" });
    }
});
// ─── LOGIN ─────────────────────────────────────────────────
exports.loginUser = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { token, refreshToken, user } = await user_service_1.userService.login(req.body);
        setRefreshTokenCookie(res, refreshToken);
        res.status(200).json({ success: true, message: "Login success", token, data: user });
    }
    catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message || "Server Error" });
    }
});
// ─── GET ALL USERS ─────────────────────────────────────────
exports.getUsers = (0, express_async_handler_1.default)(async (req, res) => {
    const result = await user_service_1.userService.getAllUsers(req.query);
    res.status(200).json({ success: true, ...result });
});
// ─── GET SINGLE USER ───────────────────────────────────────
exports.getUser = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const user = await user_service_1.userService.getUserById(req.params.id);
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
});
// ─── UPDATE USER ───────────────────────────────────────────
exports.updateUser = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const user = await user_service_1.userService.updateUser(req.params.id, req.body);
        try {
            await (0, publisher_1.publishEvent)("user_events", "USER_UPDATED", {
                userId: user.id,
                branchId: user.branch_id,
            });
        }
        catch (err) {
            console.error("Failed to publish USER_UPDATED event:", { error: err.message });
        }
        res.status(200).json({ success: true, message: "User updated successfully", data: user });
    }
    catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
});
// ─── DELETE USER ───────────────────────────────────────────
exports.deleteUser = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        await user_service_1.userService.deleteUser(req.params.id);
        try {
            await (0, publisher_1.publishEvent)("user_events", "USER_DELETED", {
                userId: req.params.id,
            });
        }
        catch (err) {
            console.error("Failed to publish USER_DELETED event:", { error: err.message });
        }
        res.status(200).json({ success: true, message: "User deleted" });
    }
    catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
});
// ─── CHANGE PASSWORD ───────────────────────────────────────
exports.changePassword = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const result = await user_service_1.userService.changePassword(req.user.id, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
});
// ─── RESET PASSWORD ────────────────────────────────────────
exports.resetPassword = (0, express_async_handler_1.default)(async (req, res) => {
    const result = await user_service_1.userService.resetPassword(req.user.id, req.body);
    res.json(result);
});
// ─── REFRESH TOKEN ─────────────────────────────────────────
exports.refreshUserToken = (0, express_async_handler_1.default)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ success: false, message: "Refresh token missing" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.env.JWT_SECRET);
        const user = await user_model_1.default.findByPk(decoded.id);
        if (!user) {
            res.status(401).json({ success: false, message: "Invalid refresh token" });
            return;
        }
        const newToken = (0, jwt_service_1.generateToken)({ id: user.id, email: user.email, role_id: user.role_id });
        const newRefreshToken = (0, jwt_service_1.generateRefreshToken)({ id: user.id, email: user.email, role_id: user.role_id });
        setRefreshTokenCookie(res, newRefreshToken);
        res.status(200).json({ success: true, token: newToken });
    }
    catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
    }
});
// ─── LOGOUT ────────────────────────────────────────────────
exports.logout = (0, express_async_handler_1.default)(async (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
});
// ─── PHONE LOGIN & OTP CONTROLLERS ─────────────────────────
exports.loginWithPhone = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const result = await user_service_1.userService.loginWithPhone(req.body.phone || "");
        res.status(200).json({ ...result, success: true, status: 200 });
    }
    catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message || "Failed to send OTP" });
    }
});
exports.verifyOtp = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { token, refreshToken, user } = await user_service_1.userService.verifyOtp(req.body);
        setRefreshTokenCookie(res, refreshToken);
        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            token,
            fcmToken: user.fcm_token,
            userDetails: user,
            status: 200,
        });
    }
    catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message || "Server error" });
    }
});
// ─── EMAIL OTP FLOW CONTROLLERS ────────────────────────────
exports.sendOtpEmail = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const result = await user_service_1.userService.sendOtpByEmail(req.body.email);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
});
exports.verifyOtpEmail = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const result = await user_service_1.userService.verifyOtpEmail(req.body);
        if (result.refreshToken)
            setRefreshTokenCookie(res, result.refreshToken);
        res.status(200).json({ success: true, message: "OTP verified", ...result });
    }
    catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
});
exports.resetPasswordEmail = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const result = await user_service_1.userService.resetPasswordWithEmail(req.user.id, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
});
// ─── BLACKLIST CONTROLLER ──────────────────────────────────
// export const getBlacklistedUsers: any = asyncHandler(async (req: Request, res: Response) => {
//   try {
//     const users = await userService.getBlacklistedUsers();
//     if (!users || users.length === 0) {
//       res.status(404).json({ success: false, message: "No blacklisted users found" });
//       return;
//     }
//     res.status(200).json({ success: true, data: users });
//   } catch (error: any) {
//     res.status(error.status || 500).json({ success: false, message: error.message });
//   }
// });
//# sourceMappingURL=user.controller.js.map