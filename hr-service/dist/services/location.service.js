"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationService = exports.LocationService = void 0;
const axios_1 = __importDefault(require("axios"));
38;
class LocationService {
    static COMPANY_SERVICE_URL = process.env.COMPANY_SERVICE_URL || "http://localhost:3003";
    async verifyAttendanceLocation(branchId, latitude, longitude) {
        if (!this.isValidCoordinate(latitude, longitude)) {
            return {
                success: false,
                message: "Location verification failed: valid latitude and longitude are required.",
            };
        }
        const branch = await this.getBranch(branchId);
        if (!branch) {
            return {
                success: false,
                message: "Location verification failed: branch details could not be fetched.",
            };
        }
        const branchLatitude = Number(branch.latitude);
        const branchLongitude = Number(branch.longitude);
        if (!this.isValidCoordinate(branchLatitude, branchLongitude)) {
            return {
                success: false,
                message: "Location verification failed: branch does not have valid coordinates configured.",
            };
        }
        const distanceMeters = this.calculateDistanceMeters(latitude, longitude, branchLatitude, branchLongitude);
        if (!branch.radius) {
            return {
                success: false,
                message: "Location verification failed: branch does not have an allowed radius configured.",
            };
        }
        const allowedRadiusMeters = Number(branch.radius);
        if (distanceMeters > allowedRadiusMeters) {
            return {
                success: false,
                message: `Location verification failed: employee is ${Math.round(distanceMeters)}m from ${branch.name || "branch"}, outside the allowed ${allowedRadiusMeters}m radius.`,
                distanceMeters,
                allowedRadiusMeters,
            };
        }
        return {
            success: true,
            message: "Location verified successfully.",
            distanceMeters,
            allowedRadiusMeters,
        };
    }
    async getBranch(branchId) {
        try {
            const response = await axios_1.default.get(`${LocationService.COMPANY_SERVICE_URL}/branch/${branchId}`, {
                validateStatus: () => true,
            });
            if (response.status !== 200 || !response.data?.success) {
                return null;
            }
            return response.data.data;
        }
        catch (error) {
            console.error("[Location-Verification] Failed to fetch branch:", error);
            return null;
        }
    }
    isValidCoordinate(latitude, longitude) {
        return (Number.isFinite(latitude) &&
            Number.isFinite(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180);
    }
    calculateDistanceMeters(lat1, lon1, lat2, lon2) {
        const earthRadiusMeters = 6371e3;
        const phi1 = this.toRadians(lat1);
        const phi2 = this.toRadians(lat2);
        const deltaPhi = this.toRadians(lat2 - lat1);
        const deltaLambda = this.toRadians(lon2 - lon1);
        const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) *
                Math.cos(phi2) *
                Math.sin(deltaLambda / 2) *
                Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusMeters * c;
    }
    toRadians(value) {
        return (value * Math.PI) / 180;
    }
}
exports.LocationService = LocationService;
exports.locationService = new LocationService();
//# sourceMappingURL=location.service.js.map