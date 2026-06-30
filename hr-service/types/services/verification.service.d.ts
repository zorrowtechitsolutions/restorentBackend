export declare class VerificationService {
    private static USER_SERVICE_URL;
    private isModelsLoaded;
    private modelLoadPromise;
    constructor();
    private loadModels;
    /**
     * Verifies if the captured image matches the user's reference image
     * @param userId The ID of the employee
     * @param capturedImage Base64 or URL of the captured selfie
     * @returns Promise<{ success: boolean; message: string }>
     */
    verifyFace(userId: number, capturedImage: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private compareFaces;
    private loadImageFromString;
}
export declare const verificationService: VerificationService;
