import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Role from "../models/role.model";
import { publishEvent } from "../events/publisher";
import axios from "axios";
import dotenv from "dotenv";
import { Op } from "sequelize";
dotenv.config();

// REGISTER - POST /role
export const createRole: any = asyncHandler(async (req: Request, res: Response) => {

  const { name, description, branchId } = req.body;

  // Check for duplicate role name within same branch
  const isExisting = await Role.findOne({
    where: {
      name,
      ...(branchId ? { branchId } : {}),
    },
  });

  if (isExisting) {
    res.status(400).json({
      success: false,
      message: "Role already exists for this scope",
      data: null,
      error: { code: "ROLE_EXIST", details: null },
    });
    return;
  }

  const newRole = await Role.create({
    name,
    description,
    branchId,
  });

  await publishEvent("role_events", "ROLE_REGISTERED", {
    roleId: newRole.id,
  });

  res.status(201).json({
    success: true,
    message: "Registration completed successfully",
    data: null,
    error: null,
  });
});

// GET ONE - GET /role/:id
export const getanRole: any = asyncHandler(async (req: Request, res: Response) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) {
    res.status(404).json({
      success: false,
      message: "Role not found",
      data: null,
      error: { code: "ROLE_NOT_FOUND", details: null },
    });
    return;
  }

  res.status(200).json({
    success: true,
    status: "Success",
    data: role,
    error: null,
  });
});

// UPDATE - PUT /role/:id
export const updateData: any = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatePayload = req.body;

  const role = await Role.update(updatePayload, {
    where: { id: id },
    returning: true,
  });

  if (!role[1] || role[1].length === 0) {
    res.status(404).json({
      success: false,
      message: "Role not found",
      status: 200,
      data: null,
      error: { code: "ROLE_NOT_FOUND", details: null },
    });
    return;
  }

  const updatedRole = role[1][0];

  await publishEvent("role_events", "ROLE_UPDATED", {
    roleId: updatedRole.id,
  });

  res.status(200).json({
    success: true,
    message: "Successfully updated",
    data: updatedRole,
    error: null,
  });
});

// DELETE - DELETE /role/:id
export const roleDelete: any = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const role = await Role.findByPk(id);
  if (!role) {
    res.status(404).json({
      success: false,
      message: "Role not found",
      data: null,
      error: { code: "ROLE_NOT_FOUND", details: null },
    });
    return;
  }

  await Role.destroy({ where: { id: id } });

  res.status(200).json({
    success: true,
    message: "Role deleted successfully",
    status: 200,
    data: null,
    error: null,
  });
});

// GET ALL - GET /role
export const getRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  let {
    branchId,
    page = 1,
    limit = 10,
    search_query,
  }: any = req.query;

  if (Array.isArray(branchId)) branchId = branchId[0];
  if (Array.isArray(page)) page = page[0];
  if (Array.isArray(limit)) limit = limit[0];
  if (Array.isArray(search_query)) search_query = search_query[0];

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const whereClause: any = {};

  if (branchId !== undefined) {
    whereClause.branchId = Number(branchId);
  }

  if (search_query) {
    whereClause[Op.or] = [
      {
        name: {
          [Op.iLike]: `%${search_query}%`,
        },
      },
    ];
  }

  const role = await Role.findAndCountAll({
    where: whereClause,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
    order: [["createdAt", "DESC"]],
  });

  const admin = await Role.findAll({
    limit: 5,
    order: [["createdAt", "ASC"]],
  });

  if (role.count === 0) {
    res.status(404).json({
      success: false,
      message: "No data found",
      data: [],
      admin,
      error: { code: "NO_DATA_FOUND", details: null },
    });
    return;
  }

  const totalPages = Math.ceil(role.count / limitNum);

  res.status(200).json({
    success: true,
    data: role.rows,
    admin,
    pagination: {
      totalItems: role.count,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPreviousPage: pageNum > 1,
    },
    error: null,
  });
  return;
});
