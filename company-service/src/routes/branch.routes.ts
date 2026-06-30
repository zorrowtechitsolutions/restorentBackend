import express from "express";
import { validate } from "../middleware/validate.middleware";
import { authenticate } from "../middleware/authenticate";
import { checkPermission } from "../middleware/role.middleware";
import {
  createBranchSchema,
  updateBranchSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
  loginWithPhoneSchema,
  verifyOtpSchema,
  sendOtpEmailSchema,
  verifyOtpEmailSchema,
  resetPasswordEmailSchema,
} from "../validation/branch.validation";
import {
  createBranch,
  getAllBranches,
  getBranch,
  updateBranch,
  deleteBranch,
  getBlacklistedBranches,
  loginBranch,
  loginWithPhone,
  verifyOtp,
  sendOtpEmail,
  verifyOtpEmail,
  resetPasswordEmail,
  changePassword,
  refreshBranchToken,
  logout,
  recoverBranch,
} from "../controllers/branch.controller";

const router = express.Router();

// ─── Auth Routes ───────────────────────────────────────────
router.post("/branch/login", validate(loginSchema), loginBranch);
router.post("/branch/login/phone", validate(loginWithPhoneSchema), loginWithPhone);
router.post("/branch/otp", validate(verifyOtpSchema), verifyOtp);

// ─── Email Password Reset Flow ────────────────────────────
router.post("/branch/auth/send-otp", validate(sendOtpEmailSchema), sendOtpEmail);
router.post("/branch/auth/verify-otp", validate(verifyOtpEmailSchema), verifyOtpEmail);
router.post("/branch/auth/reset-password", authenticate, validate(resetPasswordEmailSchema), resetPasswordEmail);

// ─── Token Routes ──────────────────────────────────────────
router.post("/branch/refresh", refreshBranchToken);
router.post("/branch/logout", authenticate, logout);

// ─── Password Routes ──────────────────────────────────────
router.put("/branch/auth/change-password", authenticate, validate(changePasswordSchema), changePassword);

// ─── CRUD Routes ───────────────────────────────────────────
router.post("/branch",  validate(createBranchSchema), createBranch);
router.get("/branch", getAllBranches);
router.get("/branch/blacklist", authenticate, checkPermission("branch", "view"), getBlacklistedBranches);
router.get("/branch/:id", getBranch);
router.put("/branch/:id",  validate(updateBranchSchema), updateBranch);
router.delete("/branch/:id",  deleteBranch);
router.put("/branch/recover/:id", authenticate, checkPermission("branch", "update"), recoverBranch);

export default router;







