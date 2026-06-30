import { Router } from "express";
import { validate, validateParams } from "../middleware/validate.middleware";
import { attendanceSchema, updateAttendanceSchema, idParamSchema } from "../validators/hr.validator";
import {
  createAttendance, getAttendances, getAttendance, updateAttendance, deleteAttendance, getDailyStatus
} from "../controllers/attendance.controller";

const router = Router();

router.post("/attendances", validate(attendanceSchema), createAttendance);
router.get("/attendances", getAttendances);
router.get("/attendances/status", getDailyStatus);
router.get("/attendances/:id", validateParams(idParamSchema), getAttendance);
router.put("/attendances/:id", validateParams(idParamSchema), validate(updateAttendanceSchema), updateAttendance);
router.delete("/attendances/:id", validateParams(idParamSchema), deleteAttendance);

export default router;
