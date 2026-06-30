import { Router } from "express";
import { validate, validateParams } from "../middleware/validate.middleware";
import { payrollSchema, updatePayrollSchema, idParamSchema } from "../validators/hr.validator";
import {
  createPayroll, getPayrolls, getPayroll, updatePayroll, deletePayroll
} from "../controllers/payroll.controller";

const router = Router();

router.post("/payrolls", validate(payrollSchema), createPayroll);
router.get("/payrolls", getPayrolls);
router.get("/payrolls/:id", validateParams(idParamSchema), getPayroll);
router.put("/payrolls/:id", validateParams(idParamSchema), validate(updatePayrollSchema), updatePayroll);
router.delete("/payrolls/:id", validateParams(idParamSchema), deletePayroll);

export default router;
