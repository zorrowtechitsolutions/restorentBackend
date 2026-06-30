export declare const branchAuthService: {
    login(data: any): Promise<{
        token: string;
        refreshToken: string;
        branch: any;
    }>;
    changePassword(branchId: string, data: any): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(branchId: string, data: any): Promise<{
        success: boolean;
        message: string;
    }>;
    loginWithPhone(phone: string): Promise<{
        message: string;
        otp: string;
    }>;
    verifyOtp(data: {
        phone: string;
        otp: string;
        fcmToken?: string;
    }): Promise<{
        token: string;
        refreshToken: string;
        branch: any;
    }>;
    sendOtpByEmail(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOtpEmail(data: {
        email: string;
        otp: string;
    }): Promise<{
        token: string;
        refreshToken: string;
        branch: any;
    }>;
    resetPasswordWithEmail(branchId: string, data: any): Promise<{
        success: boolean;
        message: string;
    }>;
};
