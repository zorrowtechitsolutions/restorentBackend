"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../middleware/validate.middleware");
const authenticate_1 = require("../middleware/authenticate");
const user_validator_1 = require("../validators/user.validator");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// ─── Auth Routes ───────────────────────────────────────────
router.post("/users", (0, validate_middleware_1.validate)(user_validator_1.registerSchema), user_controller_1.registerUser);
router.post("/users/login", (0, validate_middleware_1.validate)(user_validator_1.loginSchema), user_controller_1.loginUser);
router.post("/users/login/phone", (0, validate_middleware_1.validate)(user_validator_1.loginWithPhoneSchema), user_controller_1.loginWithPhone);
router.post("/users/otp", (0, validate_middleware_1.validate)(user_validator_1.verifyOtpSchema), user_controller_1.verifyOtp);
// ─── Email Password Reset Flow ────────────────────────────
router.post("/users/auth/send-otp", (0, validate_middleware_1.validate)(user_validator_1.sendOtpEmailSchema), user_controller_1.sendOtpEmail);
router.post("/users/auth/verify-otp", (0, validate_middleware_1.validate)(user_validator_1.verifyOtpEmailSchema), user_controller_1.verifyOtpEmail);
router.post("/users/auth/reset-password", authenticate_1.authenticate, (0, validate_middleware_1.validate)(user_validator_1.resetPasswordEmailSchema), user_controller_1.resetPasswordEmail);
// router.post("/users/password", validate(resetPasswordSchema), resetPassword);
// ─── Token Routes ──────────────────────────────────────────
router.post("/users/refresh", user_controller_1.refreshUserToken);
router.post("/users/logout", authenticate_1.authenticate, user_controller_1.logout);
// ─── Password Routes ──────────────────────────────────────
router.put("/users/auth/change-password", authenticate_1.authenticate, (0, validate_middleware_1.validate)(user_validator_1.changePasswordSchema), user_controller_1.changePassword);
// ─── CRUD Routes ───────────────────────────────────────────
router.get("/users", user_controller_1.getUsers);
// router.get("/users/blacklist", authenticate, checkPermission("users", "view"), getBlacklistedUsers);
router.get("/users/:id", (0, validate_middleware_1.validateParams)(user_validator_1.idParamSchema), user_controller_1.getUser);
router.put("/users/:id", (0, validate_middleware_1.validateParams)(user_validator_1.idParamSchema), (0, validate_middleware_1.validate)(user_validator_1.updateUserSchema), user_controller_1.updateUser);
router.delete("/users/:id", (0, validate_middleware_1.validateParams)(user_validator_1.idParamSchema), user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map