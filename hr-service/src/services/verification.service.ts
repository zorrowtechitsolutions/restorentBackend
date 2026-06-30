import axios from "axios";
import fs from "fs";
import path from "path";
// import * as tf from "@tensorflow/tfjs";
// import "@tensorflow/tfjs-backend-wasm";

// Polyfill for face-api.js browser build running in Node
import { TextEncoder, TextDecoder } from "util";
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// import * as faceapi from "@vladmandic/face-api";
import * as faceapi from "@vladmandic/face-api/dist/face-api.node-wasm.js";
import { Canvas, Image, ImageData, loadImage } from "canvas";

// Monkey patch face-api to work in NodeJS
faceapi.env.monkeyPatch({
  Canvas: Canvas as any,
  Image: Image as any,
  ImageData: ImageData as any,
  createCanvasElement: () => new Canvas(800, 600) as any
});

export class VerificationService {
  private static USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3002";
  private isModelsLoaded = false;
  private modelLoadPromise: Promise<void>;

  constructor() {
    // Store the promise so verifyFace can await it
    this.modelLoadPromise = this.loadModels();
  }

  private async loadModels() {
  try {
    console.log("faceapi keys:", Object.keys(faceapi));

    const tf = (faceapi as any).tf;

    console.log("tf exists:", !!tf);

    if (tf?.ready) {
      await tf.ready();
      console.log("Backend:", tf.getBackend?.());
    }

    const modelsPath = path.join(__dirname, "../../models");

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath);

    this.isModelsLoaded = true;
    console.log("[Face-Verification] Models loaded successfully.");
  } catch (err) {
    console.error("[Face-Verification] Failed to load models:", err);
  }
}

  // private async loadModels() {
  //   try {
  //     const modelsPath = path.join(__dirname, "../../models");
  //     await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath);
  //     await faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath);
  //     await faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath);
  //     this.isModelsLoaded = true;
  //     console.log("[Face-Verification] Models loaded successfully (WASM backend).");
  //   } catch (err) {
  //     console.error("[Face-Verification] Failed to load models:", err);
  //   }
  // }

// private async loadModels() {
//   try {
//     // Initialize TensorFlow used by face-api
//     await (faceapi as any).tf.ready();

//     console.log(
//       "[Face-Verification] Backend:",
//       (faceapi as any).tf.getBackend()
//     );

//     const modelsPath = path.join(__dirname, "../../models");

//     await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath);
//     await faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath);
//     await faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath);

//     this.isModelsLoaded = true;
//     console.log("[Face-Verification] Models loaded successfully.");
//   } catch (err) {
//     console.error("[Face-Verification] Failed to load models:", err);
//   }
// }
  /**
   * Verifies if the captured image matches the user's reference image
   * @param userId The ID of the employee
   * @param capturedImage Base64 or URL of the captured selfie
   * @returns Promise<{ success: boolean; message: string }>
   */
  public async verifyFace(userId: number, capturedImage: string): Promise<{ success: boolean; message: string }> {
    try {
      // Guard: selfie must be provided
      if (!capturedImage) {
        return { success: false, message: "Face verification failed: No selfie image was provided in the request." };
      }

      // Wait for models to finish loading before processing any request
      await this.modelLoadPromise;

      // 1. Fetch user reference image from User Service
      const userResponse = await axios.get(`${VerificationService.USER_SERVICE_URL}/users/${userId}`, {
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
    } catch (error: any) {
      console.error("[Face-Verification-Error]:", error);
      return { success: false, message: "Verification service error: " + error.message };
    }
  }

  private async compareFaces(refImgStr: string, capImgStr: string, threshold: number): Promise<{ success: boolean; message: string }> {
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
      const refDetection = await faceapi.detectSingleFace(refImg as any).withFaceLandmarks().withFaceDescriptor();
      const capDetection = await faceapi.detectSingleFace(capImg as any).withFaceLandmarks().withFaceDescriptor();

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
    } catch (error) {
      console.error("[Face-Verification-Error] Comparison failed:", error);
      return { success: false, message: "An internal server error occurred during Tensor computation." };
    }
  }

  private async loadImageFromString(imgStr: string): Promise<Image | null> {
    try {
      // If it's a URL (assuming it starts with http or /)
      if (imgStr.startsWith("http")) {
        const response = await axios.get(imgStr, { responseType: 'arraybuffer' });
        return await loadImage(Buffer.from(response.data, "binary"));
      }
      if (imgStr.startsWith("/")) {
        // Local path
        // Resolve correctly based on standard server structure
        const absolutePath = path.join(__dirname, "../../../", imgStr.includes("foodscan") ? imgStr.split("foodscan-backend")[1] : imgStr);
        // Fallback for normal server flow
        const standardPath = path.join(__dirname, "../../", imgStr);
        return await loadImage(fs.existsSync(absolutePath) ? absolutePath : standardPath);
      }
      // If it's base64
      if (imgStr.startsWith("data:image")) {
        return await loadImage(imgStr);
      }
      
      // Try treating as base64 string without data uri
      const base64Data = imgStr.replace(/^data:image\/\w+;base64,/, "");
      return await loadImage(Buffer.from(base64Data, "base64"));
    } catch (e) {
      console.error("[Face-Verification] Image load error:", e);
      return null;
    }
  }
}

export const verificationService = new VerificationService();

