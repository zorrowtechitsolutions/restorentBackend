import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import PaymentGateway from "../models/payment-gateway.model";
import Branch from "../models/branch.model";
import { Op } from "sequelize";
import { publishEvent } from "../events/publisher";
import { logger } from "../utils/logger";

// CREATE - POST /payment-gateway
export const createPaymentGateway: any = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  
  // Check if branch exists
  const branch = await Branch.findByPk(payload.branch_id);
  if (!branch) {
    res.status(404).json({ success: false, message: "Branch not found" });
    return;
  }

  const newGateway = await PaymentGateway.create(payload);

  try {
    await publishEvent("branch_events", "PAYMENT_GATEWAY_CREATED", {
      gatewayId: newGateway.id,
      branchId: newGateway.branch_id,
    });
  } catch (error: any) {
    logger.error("Failed to publish PAYMENT_GATEWAY_CREATED event", { error: error.message });
  }

  res.status(201).json({
    success: true,
    message: "Payment gateway created successfully",
    data: newGateway,
  });
});

// GET ALL - GET /payment-gateway
export const getAllPaymentGateways: any = asyncHandler(async (req: Request, res: Response) => {
  const {
    branch_id,
    upi_id,
    gpay_no,
    status,
    search_query,
    page = 1,
    limit = 10,
  }: any = req.query;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const andConditions: any[] = [];

  if (branch_id) andConditions.push({ branch_id });
  if (upi_id) andConditions.push({ upi_id: { [Op.iLike]: `%${upi_id.trim()}%` } });
  if (gpay_no) andConditions.push({ gpay_no: { [Op.iLike]: `%${gpay_no.trim()}%` } });
  if (status) andConditions.push({ status: Number(status) });

  if (search_query) {
    const search = search_query.trim();
    andConditions.push({
      [Op.or]: [
        { upi_id: { [Op.iLike]: `%${search}%` } },
        { gpay_no: { [Op.iLike]: `%${search}%` } },
      ],
    });
  }

  const { count, rows } = await PaymentGateway.findAndCountAll({
    where: andConditions.length ? { [Op.and]: andConditions } : {},
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
    order: [["createdAt", "DESC"]],
    include: [
        { model: Branch, as: "branch", attributes: ["id", "name"] }
    ]
  });

  res.status(200).json({
    success: true,
    message: "Payment gateways fetched successfully",
    data: rows,
    pagination: {
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum),
    },
  });
});

// GET ONE - GET /payment-gateway/:id
export const getPaymentGateway: any = asyncHandler(async (req: Request, res: Response) => {
  const gateway = await PaymentGateway.findByPk(req.params.id, {
    include: [{ model: Branch, as: "branch" }]
  });

  if (!gateway) {
    res.status(404).json({ success: false, message: "Payment gateway not found" });
    return;
  }

  res.status(200).json({ success: true, data: gateway });
});

// UPDATE - PUT /payment-gateway/:id
export const updatePaymentGateway: any = asyncHandler(async (req: Request, res: Response) => {
  const gateway = await PaymentGateway.findByPk(req.params.id);

  if (!gateway) {
    res.status(404).json({ success: false, message: "Payment gateway not found" });
    return;
  }

  await gateway.update(req.body);

  try {
    await publishEvent("branch_events", "PAYMENT_GATEWAY_UPDATED", {
      gatewayId: gateway.id,
      branchId: gateway.branch_id,
    });
  } catch (error: any) {
    logger.error("Failed to publish PAYMENT_GATEWAY_UPDATED event", { error: error.message });
  }

  res.status(200).json({ success: true, message: "Payment gateway updated successfully", data: gateway });
});

// DELETE (SOFT) - DELETE /payment-gateway/:id
export const deletePaymentGateway: any = asyncHandler(async (req: Request, res: Response) => {
  const gateway = await PaymentGateway.findByPk(req.params.id);

  if (!gateway) {
    res.status(404).json({ success: false, message: "Payment gateway not found" });
    return;
  }

  await gateway.destroy();

  try {
    await publishEvent("branch_events", "PAYMENT_GATEWAY_DELETED", {
      gatewayId: gateway.id,
      branchId: gateway.branch_id,
    });
  } catch (error: any) {
    logger.error("Failed to publish PAYMENT_GATEWAY_DELETED event", { error: error.message });
  }

  res.status(200).json({ success: true, message: "Payment gateway deleted successfully" });
});
