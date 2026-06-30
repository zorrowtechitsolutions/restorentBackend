import { Router } from "express";
import { createRole, getRoles, deleteRole, updateRole, getRole } from "../controllers/user-role.controller";

const router = Router();

router.post("/user-role", createRole);
router.get("/user-role", getRoles);
router.get("/user-role/:id", getRole);
router.put("/user-role/:id", updateRole);
router.delete("/user-role/:id", deleteRole);

export default router;
