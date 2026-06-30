"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyRequest = void 0;
const opossum_1 = __importDefault(require("opossum"));
const httpClient_1 = require("../utils/httpClient");
const services_1 = require("../config/services");
const logger_1 = require("../utils/logger");
const callItemsService = async (options) => {
    return (0, httpClient_1.httpClient)(options);
};
const breaker = new opossum_1.default(callItemsService, {
    timeout: 50000,
    errorThresholdPercentage: 50,
    resetTimeout: 15000,
});
breaker.fallback(() => {
    return { status: 503, data: { success: false, message: "Items service temporarily unavailable" } };
});
const proxyRequest = async (req, res, next) => {
    try {
        const url = `${services_1.SERVICES.ITEMS_SERVICE}${req.originalUrl.replace("/api/items", "/items").replace("/api/offers", "/offers").replace("/api/item-schema", "/item-schema")}`;
        const options = {
            method: req.method,
            url: url,
            data: req.body,
            params: req.query,
            headers: {
                ...(() => {
                    const { host, "content-length": contentLength, "transfer-encoding": transferEncoding, ...headers } = req.headers;
                    return headers;
                })(),
                "X-Request-ID": req.id,
            },
            validateStatus: (status) => status < 600,
        };
        const response = await breaker.fire(options);
        if (response.headers && response.headers['set-cookie']) {
            res.setHeader('Set-Cookie', response.headers['set-cookie']);
        }
        res.status(response.status).json(response.data);
    }
    catch (error) {
        if (error.response) {
            res.status(error.response.status).json({
                success: false,
                message: "Service error",
                data: error.response.data
            });
        }
        else {
            logger_1.logger.error("API Gateway Proxy Error:", {
                message: error.message,
                path: req.originalUrl,
                requestId: req.id,
            });
            res.status(503).json({
                success: false,
                message: "Service unavailable",
            });
        }
    }
};
exports.proxyRequest = proxyRequest;
