import axios from "axios";

interface BranchLocation {
  id: number;
  latitude?: number | string | null;
  longitude?: number | string | null;
  radius?: number | string | null;
  name?: string;
}
38
interface LocationVerificationResult {
  success: boolean;
  message: string;
  distanceMeters?: number;
  allowedRadiusMeters?: number;
}

export class LocationService {
  private static COMPANY_SERVICE_URL = process.env.COMPANY_SERVICE_URL || "http://localhost:3003";

  public async verifyAttendanceLocation(
    branchId: number,
    latitude: number,
    longitude: number
  ): Promise<LocationVerificationResult> {
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

    const distanceMeters = this.calculateDistanceMeters(
      latitude,
      longitude,
      branchLatitude,
      branchLongitude
    );

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

  private async getBranch(branchId: number): Promise<BranchLocation | null> {
    try {
      const response = await axios.get(`${LocationService.COMPANY_SERVICE_URL}/branch/${branchId}`, {
        validateStatus: () => true,
      });

      if (response.status !== 200 || !response.data?.success) {
        return null;
      }

      return response.data.data as BranchLocation;
    } catch (error) {
      console.error("[Location-Verification] Failed to fetch branch:", error);
      return null;
    }
  }

  private isValidCoordinate(latitude: number, longitude: number): boolean {
    return (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  private calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadiusMeters = 6371e3;
    const phi1 = this.toRadians(lat1);
    const phi2 = this.toRadians(lat2);
    const deltaPhi = this.toRadians(lat2 - lat1);
    const deltaLambda = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusMeters * c;
  }

  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }
}

export const locationService = new LocationService();

