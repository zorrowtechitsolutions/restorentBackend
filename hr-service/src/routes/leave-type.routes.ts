import { Router } from "express";
import { validate, validateParams } from "../middleware/validate.middleware";
import { leaveTypeSchema, updateLeaveTypeSchema, idParamSchema } from "../validators/hr.validator";
import {
  createLeaveType, getLeaveTypes, getLeaveType, updateLeaveType, deleteLeaveType
} from "../controllers/leave-type.controller";

const router = Router();

router.post("/leave-types", validate(leaveTypeSchema), createLeaveType);
router.get("/leave-types", getLeaveTypes);
router.get("/leave-types/:id", validateParams(idParamSchema), getLeaveType);
router.put("/leave-types/:id", validateParams(idParamSchema), validate(updateLeaveTypeSchema), updateLeaveType);
router.delete("/leave-types/:id", validateParams(idParamSchema), deleteLeaveType);

export default router;
