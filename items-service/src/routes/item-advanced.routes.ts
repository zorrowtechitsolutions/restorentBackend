import { Router } from "express";
import { validate, validateParams } from "../middleware/validate.middleware";
import {
  idParamSchema,
  itemCategorySchema, updateItemCategorySchema,
  itemTaxSchema, updateItemTaxSchema,
  itemAttributeSchema, updateItemAttributeSchema,
  itemVariationSchema, updateItemVariationSchema,
  itemExtraSchema, updateItemExtraSchema,
  itemAddonSchema, updateItemAddonSchema
} from "../validators/item-schema.validator";

import {
  createCategory, getCategories, getCategory, updateCategory, deleteCategory,
  createTax, getTaxes, getTax, updateTax, deleteTax,
  createAttribute, getAttributes, getAttribute, updateAttribute, deleteAttribute,
  createVariation, getVariations, getVariation, updateVariation, deleteVariation,
  createExtra, getExtras, getExtra, updateExtra, deleteExtra,
  createAddon, getAddons, getAddon, updateAddon, deleteAddon
} from "../controllers/item-advanced.controller";

const router = Router();

// Categories
router.post("/item-category", validate(itemCategorySchema), createCategory);
router.get("/item-category", getCategories);
router.get("/item-category/:id", validateParams(idParamSchema), getCategory);
router.put("/item-category/:id", validateParams(idParamSchema), validate(updateItemCategorySchema), updateCategory);
router.delete("/item-category/:id", validateParams(idParamSchema), deleteCategory);

// Taxes
router.post("/item-tax", validate(itemTaxSchema), createTax);
router.get("/item-tax", getTaxes);
router.get("/item-tax/:id", validateParams(idParamSchema), getTax);
router.put("/item-tax/:id", validateParams(idParamSchema), validate(updateItemTaxSchema), updateTax);
router.delete("/item-tax/:id", validateParams(idParamSchema), deleteTax);

// Attributes
router.post("/item-attribute", validate(itemAttributeSchema), createAttribute);
router.get("/item-attribute", getAttributes);
router.get("/item-attribute/:id", validateParams(idParamSchema), getAttribute);
router.put("/item-attribute/:id", validateParams(idParamSchema), validate(updateItemAttributeSchema), updateAttribute);
router.delete("/item-attribute/:id", validateParams(idParamSchema), deleteAttribute);

// Variations
router.post("/item-variation", validate(itemVariationSchema), createVariation);
router.get("/item-variation", getVariations);
router.get("/item-variation/:id", validateParams(idParamSchema), getVariation);
router.put("/item-variation/:id", validateParams(idParamSchema), validate(updateItemVariationSchema), updateVariation);
router.delete("/item-variation/:id", validateParams(idParamSchema), deleteVariation);

// Extras
router.post("/item-extra", validate(itemExtraSchema), createExtra);
router.get("/item-extra", getExtras);
router.get("/item-extra/:id", validateParams(idParamSchema), getExtra);
router.put("/item-extra/:id", validateParams(idParamSchema), validate(updateItemExtraSchema), updateExtra);
router.delete("/item-extra/:id", validateParams(idParamSchema), deleteExtra);

// Addons
router.post("/item-addon", validate(itemAddonSchema), createAddon);
router.get("/item-addon", getAddons);
router.get("/item-addon/:id", validateParams(idParamSchema), getAddon);
router.put("/item-addon/:id", validateParams(idParamSchema), validate(updateItemAddonSchema), updateAddon);
router.delete("/item-addon/:id", validateParams(idParamSchema), deleteAddon);

export default router;
