"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../middleware/validate.middleware");
const hr_validator_1 = require("../validators/hr.validator");
const office_shift_controller_1 = require("../controllers/office-shift.controller");
const router = (0, express_1.Router)();
router.post("/office-shifts", (0, validate_middleware_1.validate)(hr_validator_1.officeShiftSchema), office_shift_controller_1.createOfficeShift);
router.get("/office-shifts", office_shift_controller_1.getOfficeShifts);
router.get("/office-shifts/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), office_shift_controller_1.getOfficeShift);
router.put("/office-shifts/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), (0, validate_middleware_1.validate)(hr_validator_1.updateOfficeShiftSchema), office_shift_controller_1.updateOfficeShift);
router.delete("/office-shifts/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), office_shift_controller_1.deleteOfficeShift);
exports.default = router;
//# sourceMappingURL=office-shift.routes.js.map