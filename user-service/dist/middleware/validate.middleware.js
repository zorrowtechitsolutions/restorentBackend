"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    data: null,
                    error: {
                        code: "VALIDATION_ERROR",
                        details: errorMessages,
                    },
                });
                return;
            }
            res.status(400).json({
                success: false,
                message: "Invalid request data",
                data: null,
                error: { code: "INVALID_DATA", details: null },
            });
        }
    };
};
exports.validate = validate;
const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.params);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));
                res.status(400).json({
                    success: false,
                    message: "Invalid parameters",
                    data: null,
                    error: {
                        code: "INVALID_PARAMS",
                        details: errorMessages,
                    },
                });
                return;
            }
            res.status(400).json({
                success: false,
                message: "Invalid request parameters",
                data: null,
                error: { code: "INVALID_PARAMS", details: null },
            });
        }
    };
};
exports.validateParams = validateParams;
//# sourceMappingURL=validate.middleware.js.map