import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import LeaveType from "../models/leave-type.model";
import { publishEvent } from "../events/publisher";

export const createLeaveType: any = asyncHandler(async (req: Request, res: Response) => {
  const leaveType = await LeaveType.create(req.body);

  try {
    await publishEvent("hr_events", "LEAVE_TYPE_CREATED", {
      leaveTypeId: leaveType.id,
      branchId: leaveType.branch_id,
    });
  } catch (err: any) {
    console.error("Failed to publish LEAVE_TYPE_CREATED event:", { error: err.message });
  }

  res.status(201).json({ success: true, data: leaveType });
});

export const getLeaveTypes: any = asyncHandler(async (req: Request, res: Response) => {
  const where: any = {};
  if (req.query.branch_id) where.branch_id = req.query.branch_id;
  
  const leaveTypes = await LeaveType.findAll({ where });
  res.status(200).json({ success: true, data: leaveTypes });
});

export const getLeaveType: any = asyncHandler(async (req: Request, res: Response) => {
  const leaveType = await LeaveType.findByPk(req.params.id);
  if (!leaveType) { res.status(404).json({ success: false, message: "Leave type not found" }); return; }
  res.status(200).json({ success: true, data: leaveType });
});

export const updateLeaveType: any = asyncHandler(async (req: Request, res: Response) => {
  const leaveType = await LeaveType.findByPk(req.params.id);
  if (!leaveType) { res.status(404).json({ success: false, message: "Leave type not found" }); return; }
  await leaveType.update(req.body);

  try {
    await publishEvent("hr_events", "LEAVE_TYPE_UPDATED", {
      leaveTypeId: leaveType.id,
    });
  } catch (err: any) {
    console.error("Failed to publish LEAVE_TYPE_UPDATED event:", { error: err.message });
  }

  res.status(200).json({ success: true, data: leaveType });
});

export const deleteLeaveType: any = asyncHandler(async (req: Request, res: Response) => {
  const leaveType = await LeaveType.findByPk(req.params.id);
  if (!leaveType) { res.status(404).json({ success: false, message: "Leave type not found" }); return; }
  await leaveType.destroy();

  try {
    await publishEvent("hr_events", "LEAVE_TYPE_DELETED", {
      leaveTypeId: leaveType.id,
    });
  } catch (err: any) {
    console.error("Failed to publish LEAVE_TYPE_DELETED event:", { error: err.message });
  }

  res.status(200).json({ success: true, message: "Leave type deleted successfully" });
});
