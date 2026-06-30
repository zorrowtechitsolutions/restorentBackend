"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../middleware/validate.middleware");
const hr_validator_1 = require("../validators/hr.validator");
const holiday_controller_1 = require("../controllers/holiday.controller");
const router = (0, express_1.Router)();
router.post("/holidays", (0, validate_middleware_1.validate)(hr_validator_1.holidaySchema), holiday_controller_1.createHoliday);
router.get("/holidays", holiday_controller_1.getHolidays);
router.get("/holidays/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), holiday_controller_1.getHoliday);
router.put("/holidays/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), (0, validate_middleware_1.validate)(hr_validator_1.updateHolidaySchema), holiday_controller_1.updateHoliday);
router.delete("/holidays/:id", (0, validate_middleware_1.validateParams)(hr_validator_1.idParamSchema), holiday_controller_1.deleteHoliday);
exports.default = router;
//# sourceMappingURL=holiday.routes.js.map