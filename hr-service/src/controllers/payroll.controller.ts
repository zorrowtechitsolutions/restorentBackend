import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Payroll from "../models/payroll.model";
import { publishEvent } from "../events/publisher";

export const createPayroll: any = asyncHandler(async (req: Request, res: Response) => {
  const payroll = await Payroll.create(req.body);

  try {
    await publishEvent("hr_events", "PAYROLL_CREATED", {
      payrollId: payroll.id,
      employeeId: payroll.employee_id,
      branchId: payroll.branch_id,
    });
  } catch (err: any) {
    console.error("Failed to publish PAYROLL_CREATED event:", { error: err.message });
  }

  res.status(201).json({ success: true, data: payroll });
});

export const getPayrolls: any = asyncHandler(async (req: Request, res: Response) => {
  const where: any = {};
  if (req.query.employee_id) where.employee_id = req.query.employee_id;
  if (req.query.branch_id) where.branch_id = req.query.branch_id;

  const payrolls = await Payroll.findAll({ where });
  res.status(200).json({ success: true, data: payrolls });
});

export const getPayroll: any = asyncHandler(async (req: Request, res: Response) => {
  const payroll = await Payroll.findByPk(req.params.id);
  if (!payroll) { res.status(404).json({ success: false, message: "Payroll not found" }); return; }
  res.status(200).json({ success: true, data: payroll });
});

export const updatePayroll: any = asyncHandler(async (req: Request, res: Response) => {
  const payroll = await Payroll.findByPk(req.params.id);
  if (!payroll) { res.status(404).json({ success: false, message: "Payroll not found" }); return; }
  await payroll.update(req.body);

  try {
    await publishEvent("hr_events", "PAYROLL_UPDATED", {
      payrollId: payroll.id,
    });
  } catch (err: any) {
    console.error("Failed to publish PAYROLL_UPDATED event:", { error: err.message });
  }

  res.status(200).json({ success: true, data: payroll });
});

export const deletePayroll: any = asyncHandler(async (req: Request, res: Response) => {
  const payroll = await Payroll.findByPk(req.params.id);
  if (!payroll) { res.status(404).json({ success: false, message: "Payroll not found" }); return; }
  await payroll.destroy();

  try {
    await publishEvent("hr_events", "PAYROLL_DELETED", {
      payrollId: payroll.id,
    });
  } catch (err: any) {
    console.error("Failed to publish PAYROLL_DELETED event:", { error: err.message });
  }

  res.status(200).json({ success: true, message: "Payroll deleted successfully" });
});
