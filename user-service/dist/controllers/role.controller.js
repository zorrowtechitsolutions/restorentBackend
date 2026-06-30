"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.updateRole = exports.getRole = exports.getRoles = exports.createRole = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const role_model_1 = __importDefault(require("../models/role.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
// CREATE ROLE
exports.createRole = (0, express_async_handler_1.default)(async (req, res) => {
    const { name } = req.body;
    const role = await role_model_1.default.create({ name });
    res.status(201).json({
        success: true,
        message: "Role created successfully",
        data: role
    });
});
// GET ALL ROLES
exports.getRoles = (0, express_async_handler_1.default)(async (req, res) => {
    const roles = await role_model_1.default.findAll();
    res.status(200).json({ success: true, data: roles });
});
exports.getRole = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const role = await role_model_1.default.findByPk(id);
    if (!role) {
        res.status(404).json({ success: false, message: "Role not found" });
        return;
    }
    res.status(200).json({ success: true, data: role });
});
// UPDATE ROLE
exports.updateRole = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const role = await role_model_1.default.findByPk(id);
    if (!role) {
        res.status(404).json({ success: false, message: "Role not found" });
        return;
    }
    await role.update({ name });
    res.status(200).json({ success: true, message: "Role updated successfully", data: role });
});
// DELETE ROLE
exports.deleteRole = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const role = await role_model_1.default.findByPk(id);
    if (!role) {
        res.status(404).json({ success: false, message: "Role not found" });
        return;
    }
    // Check if role is assigned to any users
    const userCount = await user_model_1.default.count({ where: { role_id: id } });
    if (userCount > 0) {
        res.status(400).json({
            success: false,
            message: "Cannot delete role: It is currently assigned to one or more users. Please reassign the users before deleting."
        });
        return;
    }
    await role.destroy();
    res.status(200).json({ success: true, message: "Role deleted successfully" });
});
//# sourceMappingURL=role.controller.js.map