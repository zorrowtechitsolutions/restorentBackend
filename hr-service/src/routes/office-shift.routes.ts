import { Router } from "express";
import { validate, validateParams } from "../middleware/validate.middleware";
import { officeShiftSchema, updateOfficeShiftSchema, idParamSchema } from "../validators/hr.validator";
import {
  createOfficeShift, getOfficeShifts, getOfficeShift, updateOfficeShift, deleteOfficeShift
} from "../controllers/office-shift.controller";

const router = Router();

router.post("/office-shifts", validate(officeShiftSchema), createOfficeShift);
router.get("/office-shifts", getOfficeShifts);
router.get("/office-shifts/:id", validateParams(idParamSchema), getOfficeShift);
router.put("/office-shifts/:id", validateParams(idParamSchema), validate(updateOfficeShiftSchema), updateOfficeShift);
router.delete("/office-shifts/:id", validateParams(idParamSchema), deleteOfficeShift);

export default router;
