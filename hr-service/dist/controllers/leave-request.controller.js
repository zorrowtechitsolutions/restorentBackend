"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLeaveRequest = exports.updateLeaveRequest = exports.getLeaveRequest = exports.getLeaveRequests = exports.createLeaveRequest = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const leave_request_model_1 = __importDefault(require("../models/leave-request.model"));
const leave_type_model_1 = __importDefault(require("../models/leave-type.model"));
const publisher_1 = require("../events/publisher");
exports.createLeaveRequest = (0, express_async_handler_1.default)(async (req, res) => {
    const leaveRequest = await leave_request_model_1.default.create(req.body);
    try {
        await (0, publisher_1.publishEvent)("hr_events", "LEAVE_REQUEST_CREATED", {
            leaveRequestId: leaveRequest.id,
            emp_id: leaveRequest.emp_id,
        });
    }
    catch (err) {
        console.error("Failed to publish LEAVE_REQUEST_CREATED event:", { error: err.message });
    }
    res.status(201).json({ success: true, data: leaveRequest });
});
exports.getLeaveRequests = (0, express_async_handler_1.default)(async (req, res) => {
    const where = {};
    if (req.query.emp_id)
        where.emp_id = req.query.emp_id;
    if (req.query.branch_id)
        where.branch_id = req.query.branch_id;
    const leaveRequests = await leave_request_model_1.default.findAll({
        where,
        include: [{ model: leave_type_model_1.default, as: 'leaveType' }]
    });
    res.status(200).json({ success: true, data: leaveRequests });
});
exports.getLeaveRequest = (0, express_async_handler_1.default)(async (req, res) => {
    const leaveRequest = await leave_request_model_1.default.findByPk(req.params.id, {
        include: [{ model: leave_type_model_1.default, as: 'leaveType' }]
    });
    if (!leaveRequest) {
        res.status(404).json({ success: false, message: "Leave request not found" });
        return;
    }
    res.status(200).json({ success: true, data: leaveRequest });
});
exports.updateLeaveRequest = (0, express_async_handler_1.default)(async (req, res) => {
    const leaveRequest = await leave_request_model_1.default.findByPk(req.params.id);
    if (!leaveRequest) {
        res.status(404).json({ success: false, message: "Leave request not found" });
        return;
    }
    await leaveRequest.update(req.body);
    try {
        await (0, publisher_1.publishEvent)("hr_events", "LEAVE_REQUEST_UPDATED", {
            leaveRequestId: leaveRequest.id,
            emp_id: leaveRequest.emp_id,
        });
    }
    catch (err) {
        console.error("Failed to publish LEAVE_REQUEST_UPDATED event:", { error: err.message });
    }
    res.status(200).json({ success: true, data: leaveRequest });
});
exports.deleteLeaveRequest = (0, express_async_handler_1.default)(async (req, res) => {
    const leaveRequest = await leave_request_model_1.default.findByPk(req.params.id);
    if (!leaveRequest) {
        res.status(404).json({ success: false, message: "Leave request not found" });
        return;
    }
    await leaveRequest.destroy();
    try {
        await (0, publisher_1.publishEvent)("hr_events", "LEAVE_REQUEST_DELETED", {
            leaveRequestId: leaveRequest.id,
            emp_id: leaveRequest.emp_id,
        });
    }
    catch (err) {
        console.error("Failed to publish LEAVE_REQUEST_DELETED event:", { error: err.message });
    }
    res.status(200).json({ success: true, message: "Leave request deleted successfully" });
});
//# sourceMappingURL=leave-request.controller.js.map