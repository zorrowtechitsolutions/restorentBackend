import jwt from "jsonwebtoken";
export declare const generateToken: (payload: any) => string;
export declare const generateRefreshToken: (payload: any) => string;
export declare const verifyToken: (token: string) => string | jwt.JwtPayload;
