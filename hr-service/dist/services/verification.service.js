"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationService = exports.VerificationService = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Polyfill for face-api.js browser build running in Node
const util_1 = require("util");
global.TextEncoder = util_1.TextEncoder;
global.TextDecoder = util_1.TextDecoder;
const faceapi = __importStar(require("@vladmandic/face-api/dist/face-api.node-wasm.js"));
const canvas_1 = require("canvas");
// Monkey patch face-api to work in NodeJS
faceapi.env.monkeyPatch({
    Canvas: canvas_1.Canvas,
    Image: canvas_1.Image,
    ImageData: canvas_1.ImageData,
    createCanvasElement: () => new canvas_1.Canvas(800, 600)
});
class VerificationService {
    static USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3002";
    isModelsLoaded = false;
    modelLoadPromise;
    constructor() {
        // Store the promise so verifyFace can await it
        this.modelLoadPromise = this.loadModels();
    }
    async loadModels() {
        try {
            const modelsPath = path_1.default.join(__dirname, "../../models");
            await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath);
            await faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath);
            await faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath);
            this.isModelsLoaded = true;
            console.log("[Face-Verification] Models loaded successfully (WASM backend).");
        }
        catch (err) {
            console.error("[Face-Verification] Failed to load models:", err);
        }
    }
    /**
     * Verifies if the captured image matches the user's reference image
     * @param userId The ID of the employee
     * @param capturedImage Base64 or URL of the captured selfie
     * @returns Promise<{ success: boolean; message: string }>
     */
    async verifyFace(userId, capturedImage) {
        try {
            // Guard: selfie must be provided
            if (!capturedImage) {
                return { success: false, message: "Face verification failed: No selfie image was provided in the request." };
            }
            // Wait for models to finish loading before processing any request
            await this.modelLoadPromise;
            // 1. Fetch user reference image from User Service
            const userResponse = await axios_1.default.get(`${VerificationService.USER_SERVICE_URL}/users/${userId}`, {
                validateStatus: () => true
            });
            if (userResponse.status !== 200 || !userResponse.data?.success) {
                return { success: false, message: "Could not fetch user details for verification." };
            }
            const referenceImage = userResponse.data.data.image;
            if (!referenceImage) {
                return { success: false, message: "No reference image found for this user in their profile. Please update your profile photo first." };
            }
            // Euclidean distance threshold:
            // < 0.45 = Strong match (production-grade, anti-spoofing)
            // < 0.60 = Loose match (default face-api)
            const FACE_MATCH_THRESHOLD = 0.45;
            const isMatch = await this.compareFaces(referenceImage, capturedImage, FACE_MATCH_THRESHOLD);
            if (!isMatch.success) {
                return { success: false, message: isMatch.message };
            }
            return { success: true, message: "Face verified successfully." };
        }
        catch (error) {
            console.error("[Face-Verification-Error]:", error);
            return { success: false, message: "Verification service error: " + error.message };
        }
    }
    async compareFaces(refImgStr, capImgStr, threshold) {
        // BUG FIX: Never bypass — if models still aren't loaded, reject hard.
        // (modelLoadPromise is awaited before this is called, so this is a safety net only)
        if (!this.isModelsLoaded) {
            console.error("[Face-Verification] CRITICAL: Models failed to load. Rejecting attendance.");
            return { success: false, message: "Face verification is unavailable: AI models could not be loaded. Contact administrator." };
        }
        try {
            console.log(`[Face-Verification] Starting face comparison... (Strict Threshold: ${threshold})`);
            // Load Images
            const refImg = await this.loadImageFromString(refImgStr);
            const capImg = await this.loadImageFromString(capImgStr);
            if (!refImg || !capImg) {
                return { success: false, message: "Face verification failed: Could not parse one or both image files." };
            }
            // Detect faces from tensors
            console.log("[Face-Verification] Extracting tensor descriptors...");
            const refDetection = await faceapi.detectSingleFace(refImg).withFaceLandmarks().withFaceDescriptor();
            const capDetection = await faceapi.detectSingleFace(capImg).withFaceLandmarks().withFaceDescriptor();
            if (!refDetection) {
                return { success: false, message: "Face verification failed: NO FACE DETECTED in the User's Profile Image stored in the database." };
            }
            if (!capDetection) {
                return { success: false, message: "Face verification failed: NO FACE DETECTED in the selfie you just uploaded." };
            }
            // Calculate distance using Euclidean calculation
            const distance = faceapi.euclideanDistance(refDetection.descriptor, capDetection.descriptor);
            console.log(`[Face-Verification] Computed Euclidean Distance: ${distance.toFixed(4)} (Required: < ${threshold})`);
            if (distance >= threshold) {
                return {
                    success: false,
                    message: `Face verification failed: Identity mismatch. The uploaded selfie does not mathematically match the database profile photo.`
                };
            }
            return { success: true, message: "Match verified" };
        }
        catch (error) {
            console.error("[Face-Verification-Error] Comparison failed:", error);
            return { success: false, message: "An internal server error occurred during Tensor computation." };
        }
    }
    async loadImageFromString(imgStr) {
        try {
            // If it's a URL (assuming it starts with http or /)
            if (imgStr.startsWith("http")) {
                const response = await axios_1.default.get(imgStr, { responseType: 'arraybuffer' });
                return await (0, canvas_1.loadImage)(Buffer.from(response.data, "binary"));
            }
            if (imgStr.startsWith("/")) {
                // Local path
                // Resolve correctly based on standard server structure
                const absolutePath = path_1.default.join(__dirname, "../../../", imgStr.includes("foodscan") ? imgStr.split("foodscan-backend")[1] : imgStr);
                // Fallback for normal server flow
                const standardPath = path_1.default.join(__dirname, "../../", imgStr);
                return await (0, canvas_1.loadImage)(fs_1.default.existsSync(absolutePath) ? absolutePath : standardPath);
            }
            // If it's base64
            if (imgStr.startsWith("data:image")) {
                return await (0, canvas_1.loadImage)(imgStr);
            }
            // Try treating as base64 string without data uri
            const base64Data = imgStr.replace(/^data:image\/\w+;base64,/, "");
            return await (0, canvas_1.loadImage)(Buffer.from(base64Data, "base64"));
        }
        catch (e) {
            console.error("[Face-Verification] Image load error:", e);
            return null;
        }
    }
}
exports.VerificationService = VerificationService;
exports.verificationService = new VerificationService();
//# sourceMappingURL=verification.service.js.map