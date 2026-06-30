import { Router } from "express";
import { validate, validateParams } from "../middleware/validate.middleware";
import { leaveRequestSchema, updateLeaveRequestSchema, idParamSchema } from "../validators/hr.validator";
import {
  createLeaveRequest, getLeaveRequests, getLeaveRequest, updateLeaveRequest, deleteLeaveRequest
} from "../controllers/leave-request.controller";

const router = Router();

router.post("/leave-requests", validate(leaveRequestSchema), createLeaveRequest);
router.get("/leave-requests", getLeaveRequests);
router.get("/leave-requests/:id", validateParams(idParamSchema), getLeaveRequest);
router.put("/leave-requests/:id", validateParams(idParamSchema), validate(updateLeaveRequestSchema), updateLeaveRequest);
router.delete("/leave-requests/:id", validateParams(idParamSchema), deleteLeaveRequest);

export default router;
