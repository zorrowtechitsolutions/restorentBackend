export declare const userService: {
    register(data: any): Promise<any>;
    login(data: any): Promise<{
        token: string;
        refreshToken: string;
        user: any;
    }>;
    getAllUsers(query: any): Promise<{
        data: any;
        pagination: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserById(id: string): Promise<any>;
    updateUser(id: string, data: any): Promise<any>;
    deleteUser(id: string): Promise<void>;
    changePassword(userId: string, data: any): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(userId: string, data: any): Promise<{
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
        user: any;
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
        user: any;
    }>;
    resetPasswordWithEmail(userId: string, data: any): Promise<{
        success: boolean;
        message: string;
    }>;
};
