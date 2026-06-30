import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Op } from "sequelize";
import Notification from "../models/notification.model";
import { publishEvent } from "../events/publisher";
import { logger } from "../utils/logger";

// CREATE - POST /notification
export const createNotification: any = asyncHandler(async (req: Request, res: Response) => {
  const { branchIds, administratorIds, customerIds, employeeIds, waiterIds, chefIds, staffIds, superAdminIds, message } = req.body;

  const newNotification = await Notification.create({
    branchIds: branchIds || [],
    administratorIds: administratorIds || [],
    customerIds: customerIds || [],
    employeeIds: employeeIds || [],
    waiterIds: waiterIds || [],
    chefIds: chefIds || [],
    staffIds: staffIds || [],
    superAdminIds: superAdminIds || [],
    message,
    branchReadStatus: {},
    administratorReadStatus: {},
    customerReadStatus: {},
    employeeReadStatus: {},
    waiterReadStatus: {},
    chefReadStatus: {},
    staffReadStatus: {},
    superAdminReadStatus: {},
  });

  try {
    await publishEvent("branch_events", "NOTIFICATION_CREATED", {
      notificationId: newNotification.id,
    });
  } catch (error: any) {
    logger.error("Failed to publish NOTIFICATION_CREATED event", { error: error.message });
  }

  res.status(201).json({
    success: true,
    message: "Notification created successfully",
    data: newNotification,
  });
});

// GET ALL - GET /notification
export const getAllNotifications: any = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const { count, rows } = await Notification.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      limit,
    },
  });
});

// GET BY TARGET TYPE AND ID - GET /notification/:type/:id?target_role_id=...
export const getRoleNotifications: any = asyncHandler(async (req: Request, res: Response) => {
  const { role: type, id } = req.params;
  const numericId = Number(id);

  let whereCondition: any = {};

  switch (type) {
    case "branch":
      whereCondition = { branchIds: { [Op.contains]: [numericId] } };
      break;
    case "administrator":
      whereCondition = { administratorIds: { [Op.contains]: [numericId] } };
      break;
    case "customer":
      whereCondition = { customerIds: { [Op.contains]: [numericId] } };
      break;
    case "employee":
      whereCondition = { employeeIds: { [Op.contains]: [numericId] } };
      break;
    case "waiter":
      whereCondition = { waiterIds: { [Op.contains]: [numericId] } };
      break;
    case "chef":
      whereCondition = { chefIds: { [Op.contains]: [numericId] } };
      break;
    case "staff":
      whereCondition = { staffIds: { [Op.contains]: [numericId] } };
      break;
    case "superAdmin":
    case "superadmin":
      whereCondition = { superAdminIds: { [Op.contains]: [numericId] } };
      break;
    default:
      res.status(400).json({ success: false, message: "Invalid type" });
      return;
  }

  const notifications = await Notification.findAll({
    where: whereCondition,
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({ success: true, data: notifications });
});

// MARK AS READ - PUT /notification/read/:notificationId/:role/:id
export const markAsRead: any = asyncHandler(async (req: Request, res: Response) => {
  const { notificationId, role, id } = req.params;
  const numericId = Number(id);

  const notification = await Notification.findByPk(notificationId);
  if (!notification) {
    res.status(404).json({ success: false, message: "Notification not found" });
    return;
  }

  // Normalize superadmin
  const rolePrefix = role.toLowerCase() === "superadmin" ? "superAdmin" : role;
  const statusField = `${rolePrefix}ReadStatus`;

  const updatedStatus = { ...((notification as any)[statusField] || {}), [numericId]: true };

  await notification.update({
    [statusField]: updatedStatus
  } as any);

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: notification,
  });
});

// DELETE - DELETE /notification/:id
export const deleteNotification: any = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.findByPk(req.params.id);
  if (!notification) {
    res.status(404).json({ success: false, message: "Notification not found" });
    return;
  }

  await notification.destroy();

  try {
    await publishEvent("branch_events", "NOTIFICATION_DELETED", {
      notificationId: notification.id,
    });
  } catch (error: any) {
    logger.error("Failed to publish NOTIFICATION_DELETED event", { error: error.message });
  }

  res.status(200).json({ success: true, message: "Notification deleted successfully" });
});
