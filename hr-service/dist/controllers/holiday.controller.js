"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHoliday = exports.updateHoliday = exports.getHoliday = exports.getHolidays = exports.createHoliday = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const holiday_model_1 = __importDefault(require("../models/holiday.model"));
const publisher_1 = require("../events/publisher");
exports.createHoliday = (0, express_async_handler_1.default)(async (req, res) => {
    const holiday = await holiday_model_1.default.create(req.body);
    try {
        await (0, publisher_1.publishEvent)("hr_events", "HOLIDAY_CREATED", {
            holidayId: holiday.id,
            branchId: holiday.branch_id,
        });
    }
    catch (err) {
        console.error("Failed to publish HOLIDAY_CREATED event:", { error: err.message });
    }
    res.status(201).json({ success: true, data: holiday });
});
exports.getHolidays = (0, express_async_handler_1.default)(async (req, res) => {
    const where = {};
    if (req.query.branch_id)
        where.branch_id = req.query.branch_id;
    const holidays = await holiday_model_1.default.findAll({ where });
    res.status(200).json({ success: true, data: holidays });
});
exports.getHoliday = (0, express_async_handler_1.default)(async (req, res) => {
    const holiday = await holiday_model_1.default.findByPk(req.params.id);
    if (!holiday) {
        res.status(404).json({ success: false, message: "Holiday not found" });
        return;
    }
    res.status(200).json({ success: true, data: holiday });
});
exports.updateHoliday = (0, express_async_handler_1.default)(async (req, res) => {
    const holiday = await holiday_model_1.default.findByPk(req.params.id);
    if (!holiday) {
        res.status(404).json({ success: false, message: "Holiday not found" });
        return;
    }
    await holiday.update(req.body);
    try {
        await (0, publisher_1.publishEvent)("hr_events", "HOLIDAY_UPDATED", {
            holidayId: holiday.id,
        });
    }
    catch (err) {
        console.error("Failed to publish HOLIDAY_UPDATED event:", { error: err.message });
    }
    res.status(200).json({ success: true, data: holiday });
});
exports.deleteHoliday = (0, express_async_handler_1.default)(async (req, res) => {
    const holiday = await holiday_model_1.default.findByPk(req.params.id);
    if (!holiday) {
        res.status(404).json({ success: false, message: "Holiday not found" });
        return;
    }
    await holiday.destroy();
    try {
        await (0, publisher_1.publishEvent)("hr_events", "HOLIDAY_DELETED", {
            holidayId: holiday.id,
        });
    }
    catch (err) {
        console.error("Failed to publish HOLIDAY_DELETED event:", { error: err.message });
    }
    res.status(200).json({ success: true, message: "Holiday deleted successfully" });
});
//# sourceMappingURL=holiday.controller.js.map