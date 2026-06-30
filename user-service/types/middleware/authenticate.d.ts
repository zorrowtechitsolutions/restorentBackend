import { Response, NextFunction } from "express";
export declare const authenticate: (req: any, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const restrictTo: (...roles: string[]) => (req: any, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
