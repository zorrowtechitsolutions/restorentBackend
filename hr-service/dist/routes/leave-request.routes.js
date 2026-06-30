"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../middleware/validate.middleware");
const hr_validator_1 = require("../validators/hr.validator");
const leave_request_controller_1 = require("../controllers/leave-request.controller");
const router = (0, express_1.Router)();
router.post("/leave-requests", (0, validate_middleware_1.validate)(hr_validator_1.leaveRequestSchema), leave_request_controller_1.createLeaveRequest);
router.get("/leave-requests", leave_request_controller_1.getLeaveRequests);
router.get("/leave-requests/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), leave_request_controller_1.getLeaveRequest);
router.put("/leave-requests/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), (0, validate_middleware_1.validate)(hr_validator_1.updateLeaveRequestSchema), leave_request_controller_1.updateLeaveRequest);
router.delete("/leave-requests/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), leave_request_controller_1.deleteLeaveRequest);
exports.default = router;
//# sourceMappingURL=leave-request.routes.js.map