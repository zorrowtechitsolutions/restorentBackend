import { Router } from "express";
import { validate, validateParams } from "../middleware/validate.middleware";
import { holidaySchema, updateHolidaySchema, idParamSchema } from "../validators/hr.validator";
import {
  createHoliday, getHolidays, getHoliday, updateHoliday, deleteHoliday
} from "../controllers/holiday.controller";

const router = Router();

router.post("/holidays", validate(holidaySchema), createHoliday);
router.get("/holidays", getHolidays);
router.get("/holidays/:id", validateParams(idParamSchema), getHoliday);
router.put("/holidays/:id", validateParams(idParamSchema), validate(updateHolidaySchema), updateHoliday);
router.delete("/holidays/:id", validateParams(idParamSchema), deleteHoliday);

export default router;
