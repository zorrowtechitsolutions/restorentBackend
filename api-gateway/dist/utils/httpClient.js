"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
exports.httpClient = axios_1.default.create({
    timeout: 10000, // 10 seconds timeout
});
// Configure retry mechanism
(0, axios_retry_1.default)(exports.httpClient, {
    retries: 1, // Reduced to 1 to avoid long hanging requests during failures
    retryDelay: axios_retry_1.default.exponentialDelay,
    retryCondition: (error) => {
        // ONLY retry on network/connection errors. 
        // Do NOT retry on 5xx because these are usually logic/DB errors that will fail again.
        return axios_retry_1.default.isNetworkError(error);
    },
});
