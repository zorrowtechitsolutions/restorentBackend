import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import NotificationAlert from "../models/notification-alert.model";
import Branch from "../models/branch.model";
import { Op } from "sequelize";
import { publishEvent } from "../events/publisher";
import { logger } from "../utils/logger";

// CREATE - POST /notification-alert
export const createNotificationAlert: any = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  
  // Check if branch exists
  const branch = await Branch.findByPk(payload.branch_id);
  if (!branch) {
    res.status(404).json({ success: false, message: "Branch not found" });
    return;
  }

  const newAlert = await NotificationAlert.create(payload);

  try {
    await publishEvent("branch_events", "NOTIFICATION_ALERT_CREATED", {
      alertId: newAlert.id,
      branchId: newAlert.branch_id,
    });
  } catch (error: any) {
    logger.error("Failed to publish NOTIFICATION_ALERT_CREATED event", { error: error.message });
  }

  res.status(201).json({
    success: true,
    message: "Notification alert created successfully",
    data: newAlert,
  });
});

// GET ALL - GET /notification-alert
export const getAllNotificationAlerts: any = asyncHandler(async (req: Request, res: Response) => {
  const {
    branch_id,
    name,
    status,
    search_query,
    page = 1,
    limit = 10,
  }: any = req.query;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const andConditions: any[] = [];

  if (branch_id) andConditions.push({ branch_id });
  if (name) andConditions.push({ name: { [Op.iLike]: `%${name.trim()}%` } });

  if (search_query) {
    const search = search_query.trim();
    andConditions.push({
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { mail_message: { [Op.iLike]: `%${search}%` } },
        { sms_message: { [Op.iLike]: `%${search}%` } },
      ],
    });
  }

  const { count, rows } = await NotificationAlert.findAndCountAll({
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
    message: "Notification alerts fetched successfully",
    data: rows,
    pagination: {
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum),
    },
  });
});

// GET ONE - GET /notification-alert/:id
export const getNotificationAlert: any = asyncHandler(async (req: Request, res: Response) => {
  const alert = await NotificationAlert.findByPk(req.params.id, {
    include: [{ model: Branch, as: "branch" }]
  });

  if (!alert) {
    res.status(404).json({ success: false, message: "Notification alert not found" });
    return;
  }

  res.status(200).json({ success: true, data: alert });
});

// UPDATE - PUT /notification-alert/:id
export const updateNotificationAlert: any = asyncHandler(async (req: Request, res: Response) => {
  const alert = await NotificationAlert.findByPk(req.params.id);

  if (!alert) {
    res.status(404).json({ success: false, message: "Notification alert not found" });
    return;
  }

  await alert.update(req.body);

  try {
    await publishEvent("branch_events", "NOTIFICATION_ALERT_UPDATED", {
      alertId: alert.id,
      branchId: alert.branch_id,
    });
  } catch (error: any) {
    logger.error("Failed to publish NOTIFICATION_ALERT_UPDATED event", { error: error.message });
  }

  res.status(200).json({ success: true, message: "Notification alert updated successfully", data: alert });
});

// DELETE (SOFT) - DELETE /notification-alert/:id
export const deleteNotificationAlert: any = asyncHandler(async (req: Request, res: Response) => {
  const alert = await NotificationAlert.findByPk(req.params.id);

  if (!alert) {
    res.status(404).json({ success: false, message: "Notification alert not found" });
    return;
  }

  await alert.destroy();

  try {
    await publishEvent("branch_events", "NOTIFICATION_ALERT_DELETED", {
      alertId: alert.id,
      branchId: alert.branch_id,
    });
  } catch (error: any) {
    logger.error("Failed to publish NOTIFICATION_ALERT_DELETED event", { error: error.message });
  }

  res.status(200).json({ success: true, message: "Notification alert deleted successfully" });
});
