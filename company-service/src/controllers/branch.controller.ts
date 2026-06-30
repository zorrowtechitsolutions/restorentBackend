import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Branch from "../models/branch.model";
import { Op } from "sequelize";
import { publishEvent } from "../events/publisher";
import { logger } from "../utils/logger";
import bcrypt from "bcryptjs";
import { branchAuthService } from "../services/branch.auth.service";
import jwt from "jsonwebtoken";
import { generateToken, generateRefreshToken } from "../services/jwt.service";
import { env } from "../config/env";

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
    path: "/",
  });
};

// CREATE - POST /branch
export const createBranch: any = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }
  const newBranch = await Branch.create(payload);

  try {
    await publishEvent("branch_events", "BRANCH_REGISTERED", {
      branchId: newBranch.id,
      name: newBranch.name,
      email: newBranch.email,
    });
  } catch (error: any) {
    logger.error("Failed to publish BRANCH_REGISTERED event", { error: error.message });
  }

  res.status(201).json({
    success: true,
    message: "Branch created successfully",
    data: newBranch,
  });
});

// GET ALL - GET /branch
export const getAllBranches: any = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    email,
    phone,
    status,
    search_query,
    page = 1,
    limit = 10,
  }: any = req.query;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const andConditions: any[] = [];

  if (name) andConditions.push({ name: { [Op.iLike]: `%${name.trim()}%` } });
  if (email) andConditions.push({ email: { [Op.iLike]: `%${email.trim()}%` } });
  if (phone) andConditions.push({ phone: { [Op.iLike]: `%${phone.trim()}%` } });
  if (status) andConditions.push({ status: Number(status) });

  if (search_query) {
    const search = search_query.trim();
    andConditions.push({
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ],
    });
  }

  const { count, rows } = await Branch.findAndCountAll({
    where: andConditions.length ? { [Op.and]: andConditions } : {},
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    message: "Branches fetched successfully",
    data: rows,
    pagination: {
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum),
    },
  }); 
});

// GET ONE - GET /branch/:id
export const getBranch: any = asyncHandler(async (req: Request, res: Response) => {
  const branch = await Branch.findByPk(req.params.id);

  if (!branch) {
    res.status(404).json({ success: false, message: "Branch not found" });
    return;
  }

  res.status(200).json({ success: true, data: branch });
});

// UPDATE - PUT /branch/:id
export const updateBranch: any = asyncHandler(async (req: Request, res: Response) => {
  const branch = await Branch.findByPk(req.params.id);

  if (!branch) {
    res.status(404).json({ success: false, message: "Branch not found" });
    return;
  }

  await branch.update(req.body);

  try {
    await publishEvent("branch_events", "BRANCH_UPDATED", {
      branchId: branch.id,
    });
  } catch (error: any) {
    logger.error("Failed to publish BRANCH_UPDATED event", { error: error.message });
  }

  res.status(200).json({ success: true, message: "Branch updated successfully", data: branch });
});

// DELETE (SOFT) - DELETE /branch/:id
export const deleteBranch: any = asyncHandler(async (req: Request, res: Response) => {
  const branch = await Branch.findByPk(req.params.id);

  if (!branch) {
    res.status(404).json({ success: false, message: "Branch not found" });
    return;
  }

  // 🔥 Move to blacklist (soft delete)
  await branch.destroy();

  try {
    await publishEvent("branch_events", "BRANCH_DELETED", {
      branchId: branch.id,
    });
  } catch (error: any) {
    logger.error("Failed to publish BRANCH_DELETED event", { error: error.message });
  }

  res.status(200).json({ success: true, message: "Branch moved to blacklist successfully" });
});

// GET BLACKLISTED - GET /branch/blacklist
export const getBlacklistedBranches: any = asyncHandler(async (req: Request, res: Response) => {
  const branches = await Branch.findAll({
    where: {
      deletedAt: {
        [Op.not]: null,
      },
    },
    paranoid: false,
  });

  if (branches.length === 0) {
    res.status(404).json({ success: false, message: "No blacklisted branches found" });
    return;
  }

  res.status(200).json({ success: true, data: branches });
});

// RECOVER FROM BLACKLIST - PUT /branch/recover/:id
export const recoverBranch: any = asyncHandler(async (req: Request, res: Response) => {
  const branchId = req.params.id;
  const branch = await Branch.findByPk(branchId, { paranoid: false });

  if (!branch || !branch.deletedAt) {
    res.status(404).json({ success: false, message: "Blacklisted branch not found" });
    return;
  }

  await branch.restore();

  if (branch.status !== undefined) {
    branch.status = 1;
    await branch.save();
  }

  try {
    await publishEvent("branch_events", "BRANCH_RECOVERED", {
      branchId: branch.id,
    });
  } catch (error: any) {
    logger.error("Failed to publish BRANCH_RECOVERED event", { error: error.message });
  }

  res.status(200).json({ success: true, message: "Branch recovered successfully", data: branch });
});

// ─── AUTHENTICATION CONTROLLERS ────────────────────────────

export const loginBranch: any = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { token, refreshToken, branch } = await branchAuthService.login(req.body);
    setRefreshTokenCookie(res, refreshToken);
    res.status(200).json({ success: true, message: "Login success", token, data: branch });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message || "Server Error" });
  }
});

export const loginWithPhone: any = asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await branchAuthService.loginWithPhone(req.body.phone || "");
    res.status(200).json({ ...result, success: true, status: 200 });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message || "Failed to send OTP" });
  }
});

export const verifyOtp: any = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { token, refreshToken, branch } = await branchAuthService.verifyOtp(req.body);
    setRefreshTokenCookie(res, refreshToken);
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      fcmToken: branch.fcm_token,
      branchDetails: branch,
      status: 200,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message || "Server error" });
  }
});

export const sendOtpEmail: any = asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await branchAuthService.sendOtpByEmail(req.body.email);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

export const verifyOtpEmail: any = asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await branchAuthService.verifyOtpEmail(req.body);
    if (result.refreshToken) setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json({ success: true, message: "OTP verified", ...result });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

export const resetPasswordEmail: any = asyncHandler(async (req: any, res: Response) => {
  try {
    // Note: Assuming authenticate middleware sets req.user to the branch token payload.
    // If branch uses a different key, ensure middleware sets req.user or adjust accordingly.
    const branchId = req.user?.id;
    if (!branchId) {
       res.status(401).json({ success: false, message: "Unauthorized" });
       return;
    }
    const result = await branchAuthService.resetPasswordWithEmail(branchId, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

export const changePassword: any = asyncHandler(async (req: any, res: Response) => {
  try {
    const branchId = req.user?.id;
    if (!branchId) {
       res.status(401).json({ success: false, message: "Unauthorized" });
       return;
    }
    const result = await branchAuthService.changePassword(branchId, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

export const refreshBranchToken: any = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ success: false, message: "Refresh token missing" });
    return;
  }

  try {
    const decoded: any = jwt.verify(refreshToken, env.JWT_SECRET);
    const branch = await Branch.findByPk(decoded.id);

    if (!branch) {
      res.status(401).json({ success: false, message: "Invalid refresh token" });
      return;
    }

    const newToken = generateToken({ id: branch.id, email: branch.email, role_id: branch.role_id });
    const newRefreshToken = generateRefreshToken({ id: branch.id, email: branch.email, role_id: branch.role_id });

    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({ success: true, token: newToken });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
});

export const logout: any = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});
