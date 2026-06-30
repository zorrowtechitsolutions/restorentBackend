import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Item from "../models/item.model";
import ItemCategory from "../models/item-category.model";
import ItemTax from "../models/item-tax.model";
import ItemVariation from "../models/item-variation.model";
import ItemExtra from "../models/item-extra.model";
import ItemAddon from "../models/item-addon.model";
import ItemAttribute from "../models/item-attribute.model";
import { Op } from "sequelize";
import { publishEvent } from "../events/publisher";

// CREATE - POST /item
export const createItem: any = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;

  const newItem = await Item.create(payload, {
    include: ["variations", "extras", "addons"]
  });

  try {
    await publishEvent("item_events", "ITEM_CREATED", {
      itemId: newItem.id,
      itemCategoryId: newItem.item_category_id,
    });
  } catch (err: any) {
    console.error("Failed to publish ITEM_CREATED event:", { error: err.message });
  }

  res.status(201).json({
    success: true,
    message: "Item created successfully",
    data: newItem,
  });
});

// GET ALL - GET /item
export const getAllItems: any = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    item_category_id,
    item_type,
    status,
    search_query,
    page = 1,
    limit = 10,
  }: any = req.query;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const andConditions: any[] = [];

  if (name) andConditions.push({ name: { [Op.iLike]: `%${name.trim()}%` } });
  if (item_category_id) andConditions.push({ item_category_id });
  if (item_type) andConditions.push({ item_type: item_type.trim() });
  if (status) andConditions.push({ status: Number(status) });

  if (search_query) {
    const search = search_query.trim();
    andConditions.push({
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { caution: { [Op.iLike]: `%${search}%` } },
      ],
    });
  }

  const { count, rows } = await Item.findAndCountAll({
    where: andConditions.length ? { [Op.and]: andConditions } : {},
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
    order: [["createdAt", "DESC"]],
    include: [
        { model: ItemCategory, as: "category", attributes: ["id", "name"] },
        { model: ItemTax, as: "tax", attributes: ["id", "name", "tax_rate"] },
        { 
            model: ItemVariation, 
            as: "variations",
            include: [{ model: ItemAttribute, as: "attribute", attributes: ["id", "name"] }]
        },
        { model: ItemExtra, as: "extras" },
        { 
            model: ItemAddon, 
            as: "addons",
            include: [{ model: Item, as: "addonItem", attributes: ["id", "name", "price", "image"] }]
        }
    ]
  });

  res.status(200).json({
    success: true,
    message: "Items fetched successfully",
    data: rows,
    pagination: {
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum),
    },
  });
});

// GET ONE - GET /item/:id
export const getItem: any = asyncHandler(async (req: Request, res: Response) => {
  const item = await Item.findByPk(req.params.id, {
    include: [
        { model: ItemCategory, as: "category" },
        { model: ItemTax, as: "tax" },
        { 
          model: ItemVariation, 
          as: "variations",
          include: [{ model: ItemAttribute, as: "attribute" }]
        },
        { model: ItemExtra, as: "extras" },
        { 
          model: ItemAddon, 
          as: "addons",
          include: [{ model: Item, as: "addonItem" }]
        }
    ]
  });

  if (!item) {
    res.status(404).json({ success: false, message: "Item not found" });
    return;
  }

  res.status(200).json({ success: true, data: item });
});

// UPDATE - PUT /item/:id
export const updateItem: any = asyncHandler(async (req: Request, res: Response) => {
  const item = await Item.findByPk(req.params.id);

  if (!item) {
    res.status(404).json({ success: false, message: "Item not found" });
    return;
  }

  await item.update(req.body);

  try {
    await publishEvent("item_events", "ITEM_UPDATED", {
      itemId: item.id,
    });
  } catch (err: any) {
    console.error("Failed to publish ITEM_UPDATED event:", { error: err.message });
  }

  res.status(200).json({ success: true, message: "Item updated successfully", data: item });
});

// DELETE (SOFT) - DELETE /item/:id
export const deleteItem: any = asyncHandler(async (req: Request, res: Response) => {
  const item = await Item.findByPk(req.params.id);

  if (!item) {
    res.status(404).json({ success: false, message: "Item not found" });
    return;
  }

  await item.destroy();

  try {
    await publishEvent("item_events", "ITEM_DELETED", {
      itemId: item.id,
    });
  } catch (err: any) {
    console.error("Failed to publish ITEM_DELETED event:", { error: err.message });
  }

  res.status(200).json({ success: true, message: "Item deleted successfully" });
});
