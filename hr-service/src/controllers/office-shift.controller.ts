import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import OfficeShift from "../models/office-shift.model";
import { publishEvent } from "../events/publisher";

export const createOfficeShift: any = asyncHandler(async (req: Request, res: Response) => {
  const officeShift = await OfficeShift.create(req.body);

  try {
    await publishEvent("hr_events", "OFFICE_SHIFT_CREATED", {
      officeShiftId: officeShift.id,
      branchId: officeShift.branch_id,
    });
  } catch (err: any) {
    console.error("Failed to publish OFFICE_SHIFT_CREATED event:", { error: err.message });
  }

  res.status(201).json({ success: true, data: officeShift });
});

export const getOfficeShifts: any = asyncHandler(async (req: Request, res: Response) => {
  const officeShifts = await OfficeShift.findAll();
  res.status(200).json({ success: true, data: officeShifts });
});

export const getOfficeShift: any = asyncHandler(async (req: Request, res: Response) => {
  const officeShift = await OfficeShift.findByPk(req.params.id);
  if (!officeShift) { res.status(404).json({ success: false, message: "Office shift not found" }); return; }
  res.status(200).json({ success: true, data: officeShift });
});

export const updateOfficeShift: any = asyncHandler(async (req: Request, res: Response) => {
  const officeShift = await OfficeShift.findByPk(req.params.id);
  if (!officeShift) { res.status(404).json({ success: false, message: "Office shift not found" }); return; }
  await officeShift.update(req.body);

  try {
    await publishEvent("hr_events", "OFFICE_SHIFT_UPDATED", {
      officeShiftId: officeShift.id,
    });
  } catch (err: any) {
    console.error("Failed to publish OFFICE_SHIFT_UPDATED event:", { error: err.message });
  }

  res.status(200).json({ success: true, data: officeShift });
});

export const deleteOfficeShift: any = asyncHandler(async (req: Request, res: Response) => {
  const officeShift = await OfficeShift.findByPk(req.params.id);
  if (!officeShift) { res.status(404).json({ success: false, message: "Office shift not found" }); return; }
  await officeShift.destroy();

  try {
    await publishEvent("hr_events", "OFFICE_SHIFT_DELETED", {
      officeShiftId: officeShift.id,
    });
  } catch (err: any) {
    console.error("Failed to publish OFFICE_SHIFT_DELETED event:", { error: err.message });
  }

  res.status(200).json({ success: true, message: "Office shift deleted successfully" });
});
