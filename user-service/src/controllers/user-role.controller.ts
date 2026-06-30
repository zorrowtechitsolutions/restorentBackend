import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import UserRole from "../models/user-role.model";
import User from "../models/user.model";
import { publishEvent } from "../events/publisher";

// CREATE ROLE
export const createRole: any = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  const role = await UserRole.create({ name });

  try {
    await publishEvent("user_events", "USER_ROLE_CREATED", {
      roleId: role.id,
      roleName: role.name,
    });
  } catch (err: any) {
    console.error("Failed to publish USER_ROLE_CREATED event:", { error: err.message });
  }

  res.status(201).json({
    success: true,
    message: "Role created successfully",
    data: role
  });
});

// GET ALL ROLES
export const getRoles: any = asyncHandler(async (req: Request, res: Response) => {
  const roles = await UserRole.findAll();
  res.status(200).json({ success: true, data: roles });
});

export const getRole: any = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const role = await UserRole.findByPk(id);
  if (!role) {
    res.status(404).json({ success: false, message: "Role not found" });
    return;
  }
  res.status(200).json({ success: true, data: role });
});

// UPDATE ROLE
export const updateRole: any = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const role = await UserRole.findByPk(id);
  if (!role) {
    res.status(404).json({ success: false, message: "Role not found" });
    return;
  }
  await role.update({ name });

  try {
    await publishEvent("user_events", "USER_ROLE_UPDATED", {
      roleId: role.id,
      roleName: role.name,
    });
  } catch (err: any) {
    console.error("Failed to publish USER_ROLE_UPDATED event:", { error: err.message });
  }

  res.status(200).json({ success: true, message: "Role updated successfully", data: role });
});

// DELETE ROLE
export const deleteRole: any = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const role = await UserRole.findByPk(id);
  if (!role) {
    res.status(404).json({ success: false, message: "Role not found" });
    return;
  }

  
  // Check if role is assigned to any users
  const userCount = await User.count({ where: { role_id: id } });
  if (userCount > 0) {
    res.status(400).json({ 
      success: false, 
      message: "Cannot delete role: It is currently assigned to one or more users. Please reassign the users before deleting."
    });
    return;
  }
  

  await role.destroy();

  try {
    await publishEvent("user_events", "USER_ROLE_DELETED", {
      roleId: role.id,
    });
  } catch (err: any) {
    console.error("Failed to publish USER_ROLE_DELETED event:", { error: err.message });
  }

  res.status(200).json({ success: true, message: "Role deleted successfully" });
});
