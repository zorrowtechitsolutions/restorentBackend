"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_role_controller_1 = require("../controllers/user-role.controller");
const router = (0, express_1.Router)();
router.post("/user-role", user_role_controller_1.createRole);
router.get("/user-role", user_role_controller_1.getRoles);
router.get("/user-role/:id", user_role_controller_1.getRole);
router.put("/user-role/:id", user_role_controller_1.updateRole);
router.delete("/user-role/:id", user_role_controller_1.deleteRole);
exports.default = router;
//# sourceMappingURL=user-role.routes.js.map