"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePayroll = exports.updatePayroll = exports.getPayroll = exports.getPayrolls = exports.createPayroll = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const payroll_model_1 = __importDefault(require("../models/payroll.model"));
const publisher_1 = require("../events/publisher");
exports.createPayroll = (0, express_async_handler_1.default)(async (req, res) => {
    const payroll = await payroll_model_1.default.create(req.body);
    try {
        await (0, publisher_1.publishEvent)("hr_events", "PAYROLL_CREATED", {
            payrollId: payroll.id,
            employeeId: payroll.employee_id,
            branchId: payroll.branch_id,
        });
    }
    catch (err) {
        console.error("Failed to publish PAYROLL_CREATED event:", { error: err.message });
    }
    res.status(201).json({ success: true, data: payroll });
});
exports.getPayrolls = (0, express_async_handler_1.default)(async (req, res) => {
    const where = {};
    if (req.query.employee_id)
        where.employee_id = req.query.employee_id;
    if (req.query.branch_id)
        where.branch_id = req.query.branch_id;
    const payrolls = await payroll_model_1.default.findAll({ where });
    res.status(200).json({ success: true, data: payrolls });
});
exports.getPayroll = (0, express_async_handler_1.default)(async (req, res) => {
    const payroll = await payroll_model_1.default.findByPk(req.params.id);
    if (!payroll) {
        res.status(404).json({ success: false, message: "Payroll not found" });
        return;
    }
    res.status(200).json({ success: true, data: payroll });
});
exports.updatePayroll = (0, express_async_handler_1.default)(async (req, res) => {
    const payroll = await payroll_model_1.default.findByPk(req.params.id);
    if (!payroll) {
        res.status(404).json({ success: false, message: "Payroll not found" });
        return;
    }
    await payroll.update(req.body);
    try {
        await (0, publisher_1.publishEvent)("hr_events", "PAYROLL_UPDATED", {
            payrollId: payroll.id,
        });
    }
    catch (err) {
        console.error("Failed to publish PAYROLL_UPDATED event:", { error: err.message });
    }
    res.status(200).json({ success: true, data: payroll });
});
exports.deletePayroll = (0, express_async_handler_1.default)(async (req, res) => {
    const payroll = await payroll_model_1.default.findByPk(req.params.id);
    if (!payroll) {
        res.status(404).json({ success: false, message: "Payroll not found" });
        return;
    }
    await payroll.destroy();
    try {
        await (0, publisher_1.publishEvent)("hr_events", "PAYROLL_DELETED", {
            payrollId: payroll.id,
        });
    }
    catch (err) {
        console.error("Failed to publish PAYROLL_DELETED event:", { error: err.message });
    }
    res.status(200).json({ success: true, message: "Payroll deleted successfully" });
});
//# sourceMappingURL=payroll.controller.js.map