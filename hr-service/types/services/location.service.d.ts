interface LocationVerificationResult {
    success: boolean;
    message: string;
    distanceMeters?: number;
    allowedRadiusMeters?: number;
}
export declare class LocationService {
    private static COMPANY_SERVICE_URL;
    verifyAttendanceLocation(branchId: number, latitude: number, longitude: number): Promise<LocationVerificationResult>;
    private getBranch;
    private isValidCoordinate;
    private calculateDistanceMeters;
    private toRadians;
}
export declare const locationService: LocationService;
export {};
