import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createItemSchema,
  updateItemSchema,
  idParamSchema,
} from "../validators/item-schema.validator";
import {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/item.controllers";
import { authenticate } from "../middleware/authenticate";

const router = Router();

// CRUD
router.post("/item", validate(createItemSchema), createItem);
router.get("/item", getAllItems);
router.get("/item/:id", getItem);
router.put("/item/:id", validate(updateItemSchema), updateItem);
router.delete("/item/:id", deleteItem);

export default router;
