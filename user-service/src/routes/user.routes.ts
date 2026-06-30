import { Router } from "express";
import { validate, validateParams } from "../middleware/validate.middleware";
import { authenticate } from "../middleware/authenticate";
import { checkPermission } from "../middleware/role.middleware";
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
  idParamSchema,
  changePasswordSchema,
  resetPasswordSchema,
  loginWithPhoneSchema,
  verifyOtpSchema,
  sendOtpEmailSchema,
  verifyOtpEmailSchema,
  resetPasswordEmailSchema,
} from "../validators/user.validator";
import {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  resetPassword,
  refreshUserToken,
  logout,
  loginWithPhone,
  verifyOtp,
  sendOtpEmail,
  verifyOtpEmail,
  resetPasswordEmail,
  // getBlacklistedUsers,
} from "../controllers/user.controller";

const router = Router();

// ─── Auth Routes ───────────────────────────────────────────
router.post("/users", validate(registerSchema), registerUser);
router.post("/users/login", validate(loginSchema), loginUser);
router.post("/users/login/phone", validate(loginWithPhoneSchema), loginWithPhone);
router.post("/users/otp", validate(verifyOtpSchema), verifyOtp);

// ─── Email Password Reset Flow ────────────────────────────
router.post("/users/auth/send-otp", validate(sendOtpEmailSchema), sendOtpEmail);
router.post("/users/auth/verify-otp", validate(verifyOtpEmailSchema), verifyOtpEmail);
router.post("/users/auth/reset-password", authenticate, validate(resetPasswordEmailSchema), resetPasswordEmail);
// router.post("/users/password", validate(resetPasswordSchema), resetPassword);

// ─── Token Routes ──────────────────────────────────────────
router.post("/users/refresh", refreshUserToken);
router.post("/users/logout", authenticate, logout);

// ─── Password Routes ──────────────────────────────────────
router.put("/users/auth/change-password", authenticate, validate(changePasswordSchema), changePassword);

// ─── CRUD Routes ───────────────────────────────────────────
router.get("/users", getUsers);
// router.get("/users/blacklist", authenticate, checkPermission("users", "view"), getBlacklistedUsers);
router.get("/users/:id", validateParams(idParamSchema), getUser);
router.put("/users/:id", validateParams(idParamSchema), validate(updateUserSchema), updateUser);
router.delete("/users/:id", validateParams(idParamSchema), deleteUser);

export default router;




