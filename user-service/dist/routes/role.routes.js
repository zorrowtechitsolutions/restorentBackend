"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = require("../controllers/role.controller");
const router = (0, express_1.Router)();
router.post("/role", role_controller_1.createRole);
router.get("/role", role_controller_1.getRoles);
router.get("/role/:id", role_controller_1.getRole);
router.put("/role/:id", role_controller_1.updateRole);
router.delete("/role/:id", role_controller_1.deleteRole);
exports.default = router;
//# sourceMappingURL=role.routes.js.map