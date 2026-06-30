"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLeaveType = exports.updateLeaveType = exports.getLeaveType = exports.getLeaveTypes = exports.createLeaveType = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const leave_type_model_1 = __importDefault(require("../models/leave-type.model"));
const publisher_1 = require("../events/publisher");
exports.createLeaveType = (0, express_async_handler_1.default)(async (req, res) => {
    const leaveType = await leave_type_model_1.default.create(req.body);
    try {
        await (0, publisher_1.publishEvent)("hr_events", "LEAVE_TYPE_CREATED", {
            leaveTypeId: leaveType.id,
            branchId: leaveType.branch_id,
        });
    }
    catch (err) {
        console.error("Failed to publish LEAVE_TYPE_CREATED event:", { error: err.message });
    }
    res.status(201).json({ success: true, data: leaveType });
});
exports.getLeaveTypes = (0, express_async_handler_1.default)(async (req, res) => {
    const where = {};
    if (req.query.branch_id)
        where.branch_id = req.query.branch_id;
    const leaveTypes = await leave_type_model_1.default.findAll({ where });
    res.status(200).json({ success: true, data: leaveTypes });
});
exports.getLeaveType = (0, express_async_handler_1.default)(async (req, res) => {
    const leaveType = await leave_type_model_1.default.findByPk(req.params.id);
    if (!leaveType) {
        res.status(404).json({ success: false, message: "Leave type not found" });
        return;
    }
    res.status(200).json({ success: true, data: leaveType });
});
exports.updateLeaveType = (0, express_async_handler_1.default)(async (req, res) => {
    const leaveType = await leave_type_model_1.default.findByPk(req.params.id);
    if (!leaveType) {
        res.status(404).json({ success: false, message: "Leave type not found" });
        return;
    }
    await leaveType.update(req.body);
    try {
        await (0, publisher_1.publishEvent)("hr_events", "LEAVE_TYPE_UPDATED", {
            leaveTypeId: leaveType.id,
        });
    }
    catch (err) {
        console.error("Failed to publish LEAVE_TYPE_UPDATED event:", { error: err.message });
    }
    res.status(200).json({ success: true, data: leaveType });
});
exports.deleteLeaveType = (0, express_async_handler_1.default)(async (req, res) => {
    const leaveType = await leave_type_model_1.default.findByPk(req.params.id);
    if (!leaveType) {
        res.status(404).json({ success: false, message: "Leave type not found" });
        return;
    }
    await leaveType.destroy();
    try {
        await (0, publisher_1.publishEvent)("hr_events", "LEAVE_TYPE_DELETED", {
            leaveTypeId: leaveType.id,
        });
    }
    catch (err) {
        console.error("Failed to publish LEAVE_TYPE_DELETED event:", { error: err.message });
    }
    res.status(200).json({ success: true, message: "Leave type deleted successfully" });
});
//# sourceMappingURL=leave-type.controller.js.map