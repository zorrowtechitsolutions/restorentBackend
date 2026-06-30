import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { createDiningTableSchema, updateDiningTableSchema } from "../validation/dining-table.validation";
import {
  createDiningTable,
  getDiningTables,
  getDiningTable,
  updateDiningTable,
  deleteDiningTable
} from "../controllers/dining-table.controller";

const router = Router();

router.post("/dining-table", validate(createDiningTableSchema), createDiningTable);
router.get("/dining-table", getDiningTables);
router.get("/dining-table/:id", getDiningTable);
router.put("/dining-table/:id", validate(updateDiningTableSchema), updateDiningTable);
router.delete("/dining-table/:id", deleteDiningTable);

export default router;
