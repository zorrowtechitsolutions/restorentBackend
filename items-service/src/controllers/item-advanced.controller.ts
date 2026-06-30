import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ItemCategory from "../models/item-category.model";
import ItemTax from "../models/item-tax.model";
import ItemAttribute from "../models/item-attribute.model";
import ItemVariation from "../models/item-variation.model";
import ItemExtra from "../models/item-extra.model";
import ItemAddon from "../models/item-addon.model";
import { publishEvent } from "../events/publisher";

// --- CATEGORIES ---
export const createCategory: any = asyncHandler(async (req: Request, res: Response) => {
  const category = await ItemCategory.create(req.body);

  try {
    await publishEvent("item_events", "CATEGORY_CREATED", {
      categoryId: category.id,
    });
  } catch (err: any) {
    console.error("Failed to publish CATEGORY_CREATED event:", { error: err.message });
  }

  res.status(201).json({ success: true, data: category });
});

export const getCategories: any = asyncHandler(async (req: Request, res: Response) => {
  const categories = await ItemCategory.findAll();
  res.status(200).json({ success: true, data: categories });
});

export const getCategory: any = asyncHandler(async (req: Request, res: Response) => {
  const category = await ItemCategory.findByPk(req.params.id);
  if (!category) { res.status(404).json({ success: false, message: "Category not found" }); return; }
  res.status(200).json({ success: true, data: category });
});

export const updateCategory: any = asyncHandler(async (req: Request, res: Response) => {
  const category = await ItemCategory.findByPk(req.params.id);
  if (!category) { res.status(404).json({ success: false, message: "Not found" }); return; }
  await category.update(req.body);

  try {
    await publishEvent("item_events", "CATEGORY_UPDATED", {
      categoryId: category.id,
    });
  } catch (err: any) {
    console.error("Failed to publish CATEGORY_UPDATED event:", { error: err.message });
  }

  res.status(200).json({ success: true, data: category });
});

export const deleteCategory: any = asyncHandler(async (req: Request, res: Response) => {
  const category = await ItemCategory.findByPk(req.params.id);
  if (!category) { res.status(404).json({ success: false, message: "Not found" }); return; }
  await category.destroy();

  try {
    await publishEvent("item_events", "CATEGORY_DELETED", {
      categoryId: category.id,
    });
  } catch (err: any) {
    console.error("Failed to publish CATEGORY_DELETED event:", { error: err.message });
  }

  res.status(200).json({ success: true, message: "Deleted" });
});

// --- TAXES ---
export const createTax: any = asyncHandler(async (req: Request, res: Response) => {
  const tax = await ItemTax.create(req.body);

  try {
    await publishEvent("item_events", "TAX_CREATED", {
      taxId: tax.id,
    });
  } catch (err: any) {
    console.error("Failed to publish TAX_CREATED event:", { error: err.message });
  }

  res.status(201).json({ success: true, data: tax });
});

export const getTaxes: any = asyncHandler(async (req: Request, res: Response) => {
  const taxes = await ItemTax.findAll();
  res.status(200).json({ success: true, data: taxes });
});

export const getTax: any = asyncHandler(async (req: Request, res: Response) => {
  const tax = await ItemTax.findByPk(req.params.id);
  if (!tax) { res.status(404).json({ success: false, message: "Tax not found" }); return; }
  res.status(200).json({ success: true, data: tax });
});

export const updateTax: any = asyncHandler(async (req: Request, res: Response) => {
  const tax = await ItemTax.findByPk(req.params.id);
  if (!tax) { res.status(404).json({ success: false, message: "Not found" }); return; }
  await tax.update(req.body);

  try {
    await publishEvent("item_events", "TAX_UPDATED", {
      taxId: tax.id,
    });
  } catch (err: any) {
    console.error("Failed to publish TAX_UPDATED event:", { error: err.message });
  }

  res.status(200).json({ success: true, data: tax });
});

export const deleteTax: any = asyncHandler(async (req: Request, res: Response) => {
  const tax = await ItemTax.findByPk(req.params.id);
  if (!tax) { res.status(404).json({ success: false, message: "Not found" }); return; }
  await tax.destroy();

  try {
    await publishEvent("item_events", "TAX_DELETED", {
      taxId: tax.id,
    });
  } catch (err: any) {
    console.error("Failed to publish TAX_DELETED event:", { error: err.message });
  }

  res.status(200).json({ success: true, message: "Deleted" });
});

// --- ATTRIBUTES ---
export const createAttribute: any = asyncHandler(async (req: Request, res: Response) => {
  const attr = await ItemAttribute.create(req.body);
  res.status(201).json({ success: true, data: attr });
});

export const getAttributes: any = asyncHandler(async (req: Request, res: Response) => {
  const attrs = await ItemAttribute.findAll();
  res.status(200).json({ success: true, data: attrs });
});

export const getAttribute: any = asyncHandler(async (req: Request, res: Response) => {
  const attr = await ItemAttribute.findByPk(req.params.id);
  if (!attr) { res.status(404).json({ success: false, message: "Attribute not found" }); return; }
  res.status(200).json({ success: true, data: attr });
});

export const updateAttribute: any = asyncHandler(async (req: Request, res: Response) => {
  const attr = await ItemAttribute.findByPk(req.params.id);
  if (!attr) { res.status(404).json({ success: false, message: "Not found" }); return; }
  await attr.update(req.body);
  res.status(200).json({ success: true, data: attr });
});

export const deleteAttribute: any = asyncHandler(async (req: Request, res: Response) => {
  const attr = await ItemAttribute.findByPk(req.params.id);
  if (!attr) { res.status(404).json({ success: false, message: "Not found" }); return; }
  await attr.destroy();
  res.status(200).json({ success: true, message: "Deleted" });
});

// --- VARIATIONS ---
export const createVariation: any = asyncHandler(async (req: Request, res: Response) => {
  const variation = await ItemVariation.create(req.body);
  res.status(201).json({ success: true, data: variation });
});

export const getVariations: any = asyncHandler(async (req: Request, res: Response) => {
  const variations = await ItemVariation.findAll({ where: req.query.item_id ? { item_id: req.query.item_id } : {} });
  res.status(200).json({ success: true, data: variations });
});

export const getVariation: any = asyncHandler(async (req: Request, res: Response) => {
  const variation = await ItemVariation.findByPk(req.params.id);
  if (!variation) { res.status(404).json({ success: false, message: "Variation not found" }); return; }
  res.status(200).json({ success: true, data: variation });
});

export const updateVariation: any = asyncHandler(async (req: Request, res: Response) => {
  const variation = await ItemVariation.findByPk(req.params.id);
  if (!variation) { res.status(404).json({ success: false, message: "Not found" }); return; }
  await variation.update(req.body);
  res.status(200).json({ success: true, data: variation });
});

export const deleteVariation: any = asyncHandler(async (req: Request, res: Response) => {
  const variation = await ItemVariation.findByPk(req.params.id);
  if (!variation) { res.status(404).json({ success: false, message: "Not found" }); return; }
  await variation.destroy();
  res.status(200).json({ success: true, message: "Deleted" });
});

// --- EXTRAS ---
export const createExtra: any = asyncHandler(async (req: Request, res: Response) => {
  const extra = await ItemExtra.create(req.body);
  res.status(201).json({ success: true, data: extra });
});

export const getExtras: any = asyncHandler(async (req: Request, res: Response) => {
  const extras = await ItemExtra.findAll({ where: req.query.item_id ? { item_id: req.query.item_id } : {} });
  res.status(200).json({ success: true, data: extras });
});

export const getExtra: any = asyncHandler(async (req: Request, res: Response) => {
  const extra = await ItemExtra.findByPk(req.params.id);
  if (!extra) { res.status(404).json({ success: false, message: "Extra not found" }); return; }
  res.status(200).json({ success: true, data: extra });
});

export const updateExtra: any = asyncHandler(async (req: Request, res: Response) => {
  const extra = await ItemExtra.findByPk(req.params.id);
  if (!extra) { res.status(404).json({ success: false, message: "Not found" }); return; }
  await extra.update(req.body);
  res.status(200).json({ success: true, data: extra });
});

export const deleteExtra: any = asyncHandler(async (req: Request, res: Response) => {
  const extra = await ItemExtra.findByPk(req.params.id);
  if (!extra) { res.status(404).json({ success: false, message: "Not found" }); return; }
  await extra.destroy();
  res.status(200).json({ success: true, message: "Deleted" });
});

// --- ADDONS ---
export const createAddon: any = asyncHandler(async (req: Request, res: Response) => {
  const addon = await ItemAddon.create(req.body);
  res.status(201).json({ success: true, data: addon });
});

export const getAddons: any = asyncHandler(async (req: Request, res: Response) => {
  const addons = await ItemAddon.findAll({ where: req.query.item_id ? { item_id: req.query.item_id } : {} });
  res.status(200).json({ success: true, data: addons });
});

export const getAddon: any = asyncHandler(async (req: Request, res: Response) => {
  const addon = await ItemAddon.findByPk(req.params.id);
  if (!addon) { res.status(404).json({ success: false, message: "Addon not found" }); return; }
  res.status(200).json({ success: true, data: addon });
});

export const updateAddon: any = asyncHandler(async (req: Request, res: Response) => {
  const addon = await ItemAddon.findByPk(req.params.id);
  if (!addon) { res.status(404).json({ success: false, message: "Not found" }); return; }
  await addon.update(req.body);
  res.status(200).json({ success: true, data: addon });
});

export const deleteAddon: any = asyncHandler(async (req: Request, res: Response) => {
  const addon = await ItemAddon.findByPk(req.params.id);
  if (!addon) { res.status(404).json({ success: false, message: "Not found" }); return; }
  await addon.destroy();
  res.status(200).json({ success: true, message: "Deleted" });
});
