"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../middleware/validate.middleware");
const hr_validator_1 = require("../validators/hr.validator");
const attendance_controller_1 = require("../controllers/attendance.controller");
const router = (0, express_1.Router)();
router.post("/attendances", (0, validate_middleware_1.validate)(hr_validator_1.attendanceSchema), attendance_controller_1.createAttendance);
router.get("/attendances", attendance_controller_1.getAttendances);
router.get("/attendances/status", attendance_controller_1.getDailyStatus);
router.get("/attendances/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), attendance_controller_1.getAttendance);
router.put("/attendances/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), (0, validate_middleware_1.validate)(hr_validator_1.updateAttendanceSchema), attendance_controller_1.updateAttendance);
router.delete("/attendances/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), attendance_controller_1.deleteAttendance);
exports.default = router;
//# sourceMappingURL=attendance.routes.js.map