"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../middleware/validate.middleware");
const hr_validator_1 = require("../validators/hr.validator");
const leave_type_controller_1 = require("../controllers/leave-type.controller");
const router = (0, express_1.Router)();
router.post("/leave-types", (0, validate_middleware_1.validate)(hr_validator_1.leaveTypeSchema), leave_type_controller_1.createLeaveType);
router.get("/leave-types", leave_type_controller_1.getLeaveTypes);
router.get("/leave-types/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), leave_type_controller_1.getLeaveType);
router.put("/leave-types/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), (0, validate_middleware_1.validate)(hr_validator_1.updateLeaveTypeSchema), leave_type_controller_1.updateLeaveType);
router.delete("/leave-types/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), leave_type_controller_1.deleteLeaveType);
exports.default = router;
//# sourceMappingURL=leave-type.routes.js.map