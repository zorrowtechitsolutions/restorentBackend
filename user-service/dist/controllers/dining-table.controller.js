"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDiningTable = exports.updateDiningTable = exports.getDiningTable = exports.getDiningTables = exports.createDiningTable = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dining_table_model_1 = __importDefault(require("../models/dining-table.model"));
const publisher_1 = require("../events/publisher");
exports.createDiningTable = (0, express_async_handler_1.default)(async (req, res) => {
    const table = await dining_table_model_1.default.create(req.body);
    try {
        await (0, publisher_1.publishEvent)("user_events", "DINING_TABLE_CREATED", {
            tableId: table.id,
            branchId: table.branch_id,
        });
    }
    catch (err) {
        console.error("Failed to publish DINING_TABLE_CREATED event:", { error: err.message });
    }
    res.status(201).json({ success: true, data: table });
});
exports.getDiningTables = (0, express_async_handler_1.default)(async (req, res) => {
    const tables = await dining_table_model_1.default.findAll({ where: req.query.branch_id ? { branch_id: req.query.branch_id } : {} });
    res.status(200).json({ success: true, data: tables });
});
exports.getDiningTable = (0, express_async_handler_1.default)(async (req, res) => {
    const table = await dining_table_model_1.default.findByPk(req.params.id);
    if (!table) {
        res.status(404).json({ success: false, message: "Dining table not found" });
        return;
    }
    res.status(200).json({ success: true, data: table });
});
exports.updateDiningTable = (0, express_async_handler_1.default)(async (req, res) => {
    const table = await dining_table_model_1.default.findByPk(req.params.id);
    if (!table) {
        res.status(404).json({ success: false, message: "Dining table not found" });
        return;
    }
    await table.update(req.body);
    try {
        await (0, publisher_1.publishEvent)("user_events", "DINING_TABLE_UPDATED", {
            tableId: table.id,
            branchId: table.branch_id,
        });
    }
    catch (err) {
        console.error("Failed to publish DINING_TABLE_UPDATED event:", { error: err.message });
    }
    res.status(200).json({ success: true, data: table });
});
exports.deleteDiningTable = (0, express_async_handler_1.default)(async (req, res) => {
    const table = await dining_table_model_1.default.findByPk(req.params.id);
    if (!table) {
        res.status(404).json({ success: false, message: "Dining table not found" });
        return;
    }
    await table.destroy();
    try {
        await (0, publisher_1.publishEvent)("user_events", "DINING_TABLE_DELETED", {
            tableId: table.id,
        });
    }
    catch (err) {
        console.error("Failed to publish DINING_TABLE_DELETED event:", { error: err.message });
    }
    res.status(200).json({ success: true, message: "Dining table deleted successfully" });
});
//# sourceMappingURL=dining-table.controller.js.map