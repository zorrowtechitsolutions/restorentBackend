"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAttendance = exports.updateAttendance = exports.getAttendance = exports.getDailyStatus = exports.getAttendances = exports.createAttendance = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const sequelize_1 = require("sequelize");
const attendance_model_1 = __importDefault(require("../models/attendance.model"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const verification_service_1 = require("../services/verification.service");
const location_service_1 = require("../services/location.service");
const publisher_1 = require("../events/publisher");
exports.createAttendance = (0, express_async_handler_1.default)(async (req, res) => {
    const { branch_id, emp_id, type, selfie_url } = req.body;
    const latitude = req.body.latitude ?? req.body.location?.lat;
    const longitude = req.body.longitude ?? req.body.location?.lng;
    const image = req.body.image || selfie_url; // Fallback for EMS style frontend
    const currentDate = new Date();
    // Start and end of the current day for checking duplicates
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
    // 1. Double check for existing record today (Safety check)
    const existingResult = await attendance_model_1.default.findOne({
        where: {
            emp_id,
            type,
            timestamp: {
                [sequelize_1.Op.gte]: startOfDay,
                [sequelize_1.Op.lte]: endOfDay,
            }
        }
    });
    if (existingResult) {
        res.status(400).json({
            success: false,
            message: `You have already recorded a ${type} for today.`
        });
        return;
    }
    // 2. Location Verification Check
    const locationVerification = await location_service_1.locationService.verifyAttendanceLocation(branch_id, latitude, longitude);
    if (!locationVerification.success) {
        res.status(403).json({
            success: false,
            message: locationVerification.message,
            distanceMeters: locationVerification.distanceMeters,
            allowedRadiusMeters: locationVerification.allowedRadiusMeters,
        });
        return;
    }
    // 3. Face Verification Check
    const verification = await verification_service_1.verificationService.verifyFace(emp_id, image);
    if (!verification.success) {
        res.status(403).json({
            success: false,
            message: verification.message
        });
        return;
    }
    const timestamp = new Date();
    // 4. Handle Image Storage (EMS logic)
    let final_selfie_url = image;
    if (image && image.startsWith("data:image")) {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const fileName = `attendance_${emp_id}_${Date.now()}.jpg`;
        // Ensure dir exists
        const uploadDir = path_1.default.join(__dirname, "../../uploads/attendance");
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        const uploadPath = path_1.default.join(uploadDir, fileName);
        fs_1.default.writeFileSync(uploadPath, base64Data, 'base64');
        final_selfie_url = `/uploads/attendance/${fileName}`;
    }
    // 5. Determine status (Late vs Present)
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    let status = "verified";
    if (type === "check-in") {
        // Shift Start: 09:30
        if (hours > 9 || (hours === 9 && minutes > 30)) {
            status = "Late";
        }
        else {
            status = "Present";
        }
    }
    else if (type === "check-out") {
        // Shift End: 21:30 (9:30 PM)
        if (hours < 21 || (hours === 21 && minutes < 30)) {
            status = "Early Departure";
        }
        else {
            status = "Shift Completed";
        }
    }
    const attendance = await attendance_model_1.default.create({
        branch_id,
        emp_id,
        type,
        timestamp,
        latitude,
        longitude,
        selfie_url: final_selfie_url,
        status
    });
    try {
        await (0, publisher_1.publishEvent)("hr_events", "ATTENDANCE_REGISTERED", {
            attendanceId: attendance.id,
            emp_id: attendance.emp_id,
            type: attendance.type,
            status: attendance.status
        });
    }
    catch (err) {
        console.error("Failed to publish ATTENDANCE_REGISTERED event:", { error: err.message });
    }
    res.status(201).json({
        success: true,
        status,
        message: `${type} successful`,
        data: attendance
    });
});
exports.getAttendances = (0, express_async_handler_1.default)(async (req, res) => {
    const where = {};
    if (req.query.emp_id)
        where.emp_id = req.query.emp_id;
    if (req.query.branch_id)
        where.branch_id = req.query.branch_id;
    const attendances = await attendance_model_1.default.findAll({
        where,
        order: [['timestamp', 'DESC']]
    });
    res.status(200).json({ success: true, data: attendances });
});
exports.getDailyStatus = (0, express_async_handler_1.default)(async (req, res) => {
    const emp_id = req.query.emp_id || req.params.emp_id;
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
    const attendances = await attendance_model_1.default.findAll({
        where: {
            emp_id,
            timestamp: {
                [sequelize_1.Op.gte]: startOfDay,
                [sequelize_1.Op.lte]: endOfDay,
            }
        }
    });
    const hasCheckedIn = attendances.some((r) => r.type === "check-in");
    const hasCheckedOut = attendances.some((r) => r.type === "check-out");
    res.json({ success: true, hasCheckedIn, hasCheckedOut });
});
exports.getAttendance = (0, express_async_handler_1.default)(async (req, res) => {
    const attendance = await attendance_model_1.default.findByPk(req.params.id);
    if (!attendance) {
        res.status(404).json({ success: false, message: "Attendance not found" });
        return;
    }
    res.status(200).json({ success: true, data: attendance });
});
exports.updateAttendance = (0, express_async_handler_1.default)(async (req, res) => {
    const attendance = await attendance_model_1.default.findByPk(req.params.id);
    if (!attendance) {
        res.status(404).json({ success: false, message: "Attendance not found" });
        return;
    }
    await attendance.update(req.body);
    try {
        await (0, publisher_1.publishEvent)("hr_events", "ATTENDANCE_UPDATED", {
            attendanceId: attendance.id,
            emp_id: attendance.emp_id,
        });
    }
    catch (err) {
        console.error("Failed to publish ATTENDANCE_UPDATED event:", { error: err.message });
    }
    res.status(200).json({ success: true, data: attendance });
});
exports.deleteAttendance = (0, express_async_handler_1.default)(async (req, res) => {
    const attendance = await attendance_model_1.default.findByPk(req.params.id);
    if (!attendance) {
        res.status(404).json({ success: false, message: "Attendance not found" });
        return;
    }
    await attendance.destroy();
    try {
        await (0, publisher_1.publishEvent)("hr_events", "ATTENDANCE_DELETED", {
            attendanceId: attendance.id,
            emp_id: attendance.emp_id,
        });
    }
    catch (err) {
        console.error("Failed to publish ATTENDANCE_DELETED event:", { error: err.message });
    }
    res.status(200).json({ success: true, message: "Attendance deleted successfully" });
});
//# sourceMappingURL=attendance.controller.js.map