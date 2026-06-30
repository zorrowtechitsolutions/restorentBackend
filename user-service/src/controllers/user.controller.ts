import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { userService } from "../services/user.service";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { generateToken, generateRefreshToken } from "../services/jwt.service";
import { env } from "../config/env";
import { publishEvent } from "../events/publisher";

// ─── Helper: Set Refresh Token Cookie ──────────────────────
const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
    path: "/",
  });
};

// ─── REGISTER ──────────────────────────────────────────────
export const registerUser: any = asyncHandler(async (req: Request, res: Response) => {
  try {
    const data = await userService.register(req.body);

    try {
      await publishEvent("user_events", "USER_REGISTERED", {
        userId: data.user.id,
        roleId: data.user.role_id,
        branchId: data.user.branch_id,
      });
    } catch (err: any) {
      console.error("Failed to publish USER_REGISTERED event:", { error: err.message });
    }

    res.status(201).json({ success: true, message: "User registered successfully", data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message || "Server Error" });
  }
});

// ─── LOGIN ─────────────────────────────────────────────────
export const loginUser: any = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { token, refreshToken, user } = await userService.login(req.body);
    setRefreshTokenCookie(res, refreshToken);
    res.status(200).json({ success: true, message: "Login success", token, data: user });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message || "Server Error" });
  }
});

// ─── GET ALL USERS ─────────────────────────────────────────
export const getUsers: any = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getAllUsers(req.query);
  res.status(200).json({ success: true, ...result });
});

// ─── GET SINGLE USER ───────────────────────────────────────
export const getUser: any = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

// ─── UPDATE USER ───────────────────────────────────────────
export const updateUser: any = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    try {
      await publishEvent("user_events", "USER_UPDATED", {
        userId: user.id,
        branchId: user.branch_id,
      });
    } catch (err: any) {
      console.error("Failed to publish USER_UPDATED event:", { error: err.message });
    }

    res.status(200).json({ success: true, message: "User updated successfully", data: user });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

// ─── DELETE USER ───────────────────────────────────────────
export const deleteUser: any = asyncHandler(async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(req.params.id);

    try {
      await publishEvent("user_events", "USER_DELETED", {
        userId: req.params.id,
      });
    } catch (err: any) {
      console.error("Failed to publish USER_DELETED event:", { error: err.message });
    }

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

// ─── CHANGE PASSWORD ───────────────────────────────────────
export const changePassword: any = asyncHandler(async (req: any, res: Response) => {
  try {
    const result = await userService.changePassword(req.user.id, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

// ─── RESET PASSWORD ────────────────────────────────────────
export const resetPassword: any = asyncHandler(async (req: any, res: Response) => {
  const result = await userService.resetPassword(req.user.id, req.body);
  res.json(result);
});

// ─── REFRESH TOKEN ─────────────────────────────────────────
export const refreshUserToken: any = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ success: false, message: "Refresh token missing" });
    return;
  }

  try {
    const decoded: any = jwt.verify(refreshToken, env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid refresh token" });
      return;
    }

    const newToken = generateToken({ id: user.id, email: user.email, role_id: user.role_id });
    const newRefreshToken = generateRefreshToken({ id: user.id, email: user.email, role_id: user.role_id });

    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({ success: true, token: newToken });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
});

// ─── LOGOUT ────────────────────────────────────────────────
export const logout: any = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// ─── PHONE LOGIN & OTP CONTROLLERS ─────────────────────────
export const loginWithPhone: any = asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await userService.loginWithPhone(req.body.phone || "");
    res.status(200).json({ ...result, success: true, status: 200 });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message || "Failed to send OTP" });
  }
});

export const verifyOtp: any = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { token, refreshToken, user } = await userService.verifyOtp(req.body);
    setRefreshTokenCookie(res, refreshToken);
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      fcmToken: user.fcm_token,
      userDetails: user,
      status: 200,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message || "Server error" });
  }
});

// ─── EMAIL OTP FLOW CONTROLLERS ────────────────────────────
export const sendOtpEmail: any = asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await userService.sendOtpByEmail(req.body.email);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

export const verifyOtpEmail: any = asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await userService.verifyOtpEmail(req.body);
    if (result.refreshToken) setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json({ success: true, message: "OTP verified", ...result });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

export const resetPasswordEmail: any = asyncHandler(async (req: any, res: Response) => {
  try {
    const result = await userService.resetPasswordWithEmail(
      req.user.id,
      req.body
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

// ─── BLACKLIST CONTROLLER ──────────────────────────────────
// export const getBlacklistedUsers: any = asyncHandler(async (req: Request, res: Response) => {
//   try {
//     const users = await userService.getBlacklistedUsers();
//     if (!users || users.length === 0) {
//       res.status(404).json({ success: false, message: "No blacklisted users found" });
//       return;
//     }
//     res.status(200).json({ success: true, data: users });
//   } catch (error: any) {
//     res.status(error.status || 500).json({ success: false, message: error.message });
//   }
// });
