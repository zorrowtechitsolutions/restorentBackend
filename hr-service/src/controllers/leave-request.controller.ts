import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import LeaveRequest from "../models/leave-request.model";
import LeaveType from "../models/leave-type.model";
import { publishEvent } from "../events/publisher";

export const createLeaveRequest: any = asyncHandler(async (req: Request, res: Response) => {
  const leaveRequest = await LeaveRequest.create(req.body);

  try {
    await publishEvent("hr_events", "LEAVE_REQUEST_CREATED", {
      leaveRequestId: leaveRequest.id,
      emp_id: leaveRequest.emp_id,
    });
  } catch (err: any) {
    console.error("Failed to publish LEAVE_REQUEST_CREATED event:", { error: err.message });
  }

  res.status(201).json({ success: true, data: leaveRequest });
});

export const getLeaveRequests: any = asyncHandler(async (req: Request, res: Response) => {
  const where: any = {};
  if (req.query.emp_id) where.emp_id = req.query.emp_id;
  if (req.query.branch_id) where.branch_id = req.query.branch_id;
  
  const leaveRequests = await LeaveRequest.findAll({ 
    where,
    include: [{ model: LeaveType, as: 'leaveType' }]
  });
  res.status(200).json({ success: true, data: leaveRequests });
});

export const getLeaveRequest: any = asyncHandler(async (req: Request, res: Response) => {
  const leaveRequest = await LeaveRequest.findByPk(req.params.id, {
    include: [{ model: LeaveType, as: 'leaveType' }]
  });
  if (!leaveRequest) { res.status(404).json({ success: false, message: "Leave request not found" }); return; }
  res.status(200).json({ success: true, data: leaveRequest });
});

export const updateLeaveRequest: any = asyncHandler(async (req: Request, res: Response) => {
  const leaveRequest = await LeaveRequest.findByPk(req.params.id);
  if (!leaveRequest) { res.status(404).json({ success: false, message: "Leave request not found" }); return; }
  await leaveRequest.update(req.body);

  try {
    await publishEvent("hr_events", "LEAVE_REQUEST_UPDATED", {
      leaveRequestId: leaveRequest.id,
      emp_id: leaveRequest.emp_id,
    });
  } catch (err: any) {
    console.error("Failed to publish LEAVE_REQUEST_UPDATED event:", { error: err.message });
  }

  res.status(200).json({ success: true, data: leaveRequest });
});

export const deleteLeaveRequest: any = asyncHandler(async (req: Request, res: Response) => {
  const leaveRequest = await LeaveRequest.findByPk(req.params.id);
  if (!leaveRequest) { res.status(404).json({ success: false, message: "Leave request not found" }); return; }
  await leaveRequest.destroy();

  try {
    await publishEvent("hr_events", "LEAVE_REQUEST_DELETED", {
      leaveRequestId: leaveRequest.id,
      emp_id: leaveRequest.emp_id,
    });
  } catch (err: any) {
    console.error("Failed to publish LEAVE_REQUEST_DELETED event:", { error: err.message });
  }

  res.status(200).json({ success: true, message: "Leave request deleted successfully" });
});
