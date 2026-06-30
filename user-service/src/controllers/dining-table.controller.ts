import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import DiningTable from "../models/dining-table.model";
import { publishEvent } from "../events/publisher";

export const createDiningTable: any = asyncHandler(async (req: Request, res: Response) => {
  const table = await DiningTable.create(req.body);

  try {
    await publishEvent("user_events", "DINING_TABLE_CREATED", {
      tableId: table.id,
      branchId: table.branch_id,
    });
  } catch (err: any) {
    console.error("Failed to publish DINING_TABLE_CREATED event:", { error: err.message });
  }

  res.status(201).json({ success: true, data: table });
});

export const getDiningTables: any = asyncHandler(async (req: Request, res: Response) => {
  const tables = await DiningTable.findAll({ where: req.query.branch_id ? { branch_id: req.query.branch_id } : {} });
  res.status(200).json({ success: true, data: tables });
});

export const getDiningTable: any = asyncHandler(async (req: Request, res: Response) => {
  const table = await DiningTable.findByPk(req.params.id);
  if (!table) {
    res.status(404).json({ success: false, message: "Dining table not found" });
    return;
  }
  res.status(200).json({ success: true, data: table });
});

export const updateDiningTable: any = asyncHandler(async (req: Request, res: Response) => {
  const table = await DiningTable.findByPk(req.params.id);
  if (!table) {
    res.status(404).json({ success: false, message: "Dining table not found" });
    return;
  }
  await table.update(req.body);

  try {
    await publishEvent("user_events", "DINING_TABLE_UPDATED", {
      tableId: table.id,
      branchId: table.branch_id,
    });
  } catch (err: any) {
    console.error("Failed to publish DINING_TABLE_UPDATED event:", { error: err.message });
  }

  res.status(200).json({ success: true, data: table });
});

export const deleteDiningTable: any = asyncHandler(async (req: Request, res: Response) => {
  const table = await DiningTable.findByPk(req.params.id);
  if (!table) {
    res.status(404).json({ success: false, message: "Dining table not found" });
    return;
  }
  await table.destroy();

  try {
    await publishEvent("user_events", "DINING_TABLE_DELETED", {
      tableId: table.id,
    });
  } catch (err: any) {
    console.error("Failed to publish DINING_TABLE_DELETED event:", { error: err.message });
  }

  res.status(200).json({ success: true, message: "Dining table deleted successfully" });
});
