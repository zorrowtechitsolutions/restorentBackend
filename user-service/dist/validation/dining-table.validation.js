"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDiningTableSchema = exports.createDiningTableSchema = void 0;
const zod_1 = require("zod");
exports.createDiningTableSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    slug: zod_1.z.string().min(1, "Slug is required"),
    size: zod_1.z.number().int().min(1, "Size must be at least 1"),
    qr_code: zod_1.z.string().optional(),
    branch_id: zod_1.z.number().int(),
    status: zod_1.z.number().int().optional().default(1),
    creator_type: zod_1.z.string().optional(),
    creator_id: zod_1.z.number().int().optional(),
});
exports.updateDiningTableSchema = exports.createDiningTableSchema.partial();
//# sourceMappingURL=dining-table.validation.js.map