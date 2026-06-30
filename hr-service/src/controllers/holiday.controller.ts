import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Holiday from "../models/holiday.model";
import { publishEvent } from "../events/publisher";

export const createHoliday: any = asyncHandler(async (req: Request, res: Response) => {
  const holiday = await Holiday.create(req.body);

  try {
    await publishEvent("hr_events", "HOLIDAY_CREATED", {
      holidayId: holiday.id,
      branchId: holiday.branch_id,
    });
  } catch (err: any) {
    console.error("Failed to publish HOLIDAY_CREATED event:", { error: err.message });
  }

  res.status(201).json({ success: true, data: holiday });
});

export const getHolidays: any = asyncHandler(async (req: Request, res: Response) => {
  const where: any = {};
  if (req.query.branch_id) where.branch_id = req.query.branch_id;

  const holidays = await Holiday.findAll({ where });
  res.status(200).json({ success: true, data: holidays });
});

export const getHoliday: any = asyncHandler(async (req: Request, res: Response) => {
  const holiday = await Holiday.findByPk(req.params.id);
  if (!holiday) { res.status(404).json({ success: false, message: "Holiday not found" }); return; }
  res.status(200).json({ success: true, data: holiday });
});

export const updateHoliday: any = asyncHandler(async (req: Request, res: Response) => {
  const holiday = await Holiday.findByPk(req.params.id);
  if (!holiday) { res.status(404).json({ success: false, message: "Holiday not found" }); return; }
  await holiday.update(req.body);

  try {
    await publishEvent("hr_events", "HOLIDAY_UPDATED", {
      holidayId: holiday.id,
    });
  } catch (err: any) {
    console.error("Failed to publish HOLIDAY_UPDATED event:", { error: err.message });
  }

  res.status(200).json({ success: true, data: holiday });
});

export const deleteHoliday: any = asyncHandler(async (req: Request, res: Response) => {
  const holiday = await Holiday.findByPk(req.params.id);
  if (!holiday) { res.status(404).json({ success: false, message: "Holiday not found" }); return; }
  await holiday.destroy();

  try {
    await publishEvent("hr_events", "HOLIDAY_DELETED", {
      holidayId: holiday.id,
    });
  } catch (err: any) {
    console.error("Failed to publish HOLIDAY_DELETED event:", { error: err.message });
  }

  res.status(200).json({ success: true, message: "Holiday deleted successfully" });
});
