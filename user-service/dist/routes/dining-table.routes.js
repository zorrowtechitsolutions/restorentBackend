"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../middleware/validate.middleware");
const dining_table_validation_1 = require("../validation/dining-table.validation");
const dining_table_controller_1 = require("../controllers/dining-table.controller");
const router = (0, express_1.Router)();
router.post("/dining-table", (0, validate_middleware_1.validate)(dining_table_validation_1.createDiningTableSchema), dining_table_controller_1.createDiningTable);
router.get("/dining-table", dining_table_controller_1.getDiningTables);
router.get("/dining-table/:id", dining_table_controller_1.getDiningTable);
router.put("/dining-table/:id", (0, validate_middleware_1.validate)(dining_table_validation_1.updateDiningTableSchema), dining_table_controller_1.updateDiningTable);
router.delete("/dining-table/:id", dining_table_controller_1.deleteDiningTable);
exports.default = router;
//# sourceMappingURL=dining-table.routes.js.map