"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./user.routes"));
const company_routes_1 = __importDefault(require("./company.routes"));
const items_routes_1 = __importDefault(require("./items.routes"));
const role_routes_1 = __importDefault(require("./role.routes"));
const hr_routes_1 = __importDefault(require("./hr.routes"));
const router = express_1.default.Router();
router.use("/", user_routes_1.default);
router.use("/", company_routes_1.default);
router.use("/", items_routes_1.default);
router.use("/", role_routes_1.default);
router.use("/", hr_routes_1.default);
exports.default = router;
