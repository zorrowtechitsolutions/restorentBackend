"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOfficeShift = exports.updateOfficeShift = exports.getOfficeShift = exports.getOfficeShifts = exports.createOfficeShift = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const office_shift_model_1 = __importDefault(require("../models/office-shift.model"));
const publisher_1 = require("../events/publisher");
exports.createOfficeShift = (0, express_async_handler_1.default)(async (req, res) => {
    const officeShift = await office_shift_model_1.default.create(req.body);
    try {
        await (0, publisher_1.publishEvent)("hr_events", "OFFICE_SHIFT_CREATED", {
            officeShiftId: officeShift.id,
            branchId: officeShift.branch_id,
        });
    }
    catch (err) {
        console.error("Failed to publish OFFICE_SHIFT_CREATED event:", { error: err.message });
    }
    res.status(201).json({ success: true, data: officeShift });
});
exports.getOfficeShifts = (0, express_async_handler_1.default)(async (req, res) => {
    const officeShifts = await office_shift_model_1.default.findAll();
    res.status(200).json({ success: true, data: officeShifts });
});
exports.getOfficeShift = (0, express_async_handler_1.default)(async (req, res) => {
    const officeShift = await office_shift_model_1.default.findByPk(req.params.id);
    if (!officeShift) {
        res.status(404).json({ success: false, message: "Office shift not found" });
        return;
    }
    res.status(200).json({ success: true, data: officeShift });
});
exports.updateOfficeShift = (0, express_async_handler_1.default)(async (req, res) => {
    const officeShift = await office_shift_model_1.default.findByPk(req.params.id);
    if (!officeShift) {
        res.status(404).json({ success: false, message: "Office shift not found" });
        return;
    }
    await officeShift.update(req.body);
    try {
        await (0, publisher_1.publishEvent)("hr_events", "OFFICE_SHIFT_UPDATED", {
            officeShiftId: officeShift.id,
        });
    }
    catch (err) {
        console.error("Failed to publish OFFICE_SHIFT_UPDATED event:", { error: err.message });
    }
    res.status(200).json({ success: true, data: officeShift });
});
exports.deleteOfficeShift = (0, express_async_handler_1.default)(async (req, res) => {
    const officeShift = await office_shift_model_1.default.findByPk(req.params.id);
    if (!officeShift) {
        res.status(404).json({ success: false, message: "Office shift not found" });
        return;
    }
    await officeShift.destroy();
    try {
        await (0, publisher_1.publishEvent)("hr_events", "OFFICE_SHIFT_DELETED", {
            officeShiftId: officeShift.id,
        });
    }
    catch (err) {
        console.error("Failed to publish OFFICE_SHIFT_DELETED event:", { error: err.message });
    }
    res.status(200).json({ success: true, message: "Office shift deleted successfully" });
});
//# sourceMappingURL=office-shift.controller.js.map