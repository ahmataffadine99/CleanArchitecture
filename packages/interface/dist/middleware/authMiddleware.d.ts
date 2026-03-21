import { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: {
                sub: string;
                role: string;
                profilId: string;
                email: string;
            };
        }
    }
}
export declare function creerAuthMiddleware(secretJwt: string): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare function requireRole(role: string): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authMiddleware.d.ts.map