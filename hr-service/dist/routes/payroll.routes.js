"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../middleware/validate.middleware");
const hr_validator_1 = require("../validators/hr.validator");
const payroll_controller_1 = require("../controllers/payroll.controller");
const router = (0, express_1.Router)();
router.post("/payrolls", (0, validate_middleware_1.validate)(hr_validator_1.payrollSchema), payroll_controller_1.createPayroll);
router.get("/payrolls", payroll_controller_1.getPayrolls);
router.get("/payrolls/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), payroll_controller_1.getPayroll);
router.put("/payrolls/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), (0, validate_middleware_1.validate)(hr_validator_1.updatePayrollSchema), payroll_controller_1.updatePayroll);
router.delete("/payrolls/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), payroll_controller_1.deletePayroll);
exports.default = router;
//# sourceMappingURL=payroll.routes.js.map