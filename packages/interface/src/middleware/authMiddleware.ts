import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extension de l'interface Request d'Express pour y stocker les infos de l'utilisateur connecté
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

export function creerAuthMiddleware(secretJwt: string) {
  return function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log(`[Auth] Header manquant/invalide pour ${req.method} ${req.path}`, req.headers);
      return res.status(401).json({ error: "Token JWT manquant ou mal formaté" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, secretJwt) as any;
      req.user = {
        sub: decoded.sub,
        role: decoded.role,
        profilId: decoded.profilId,
        email: decoded.email,
      };
      next();
    } catch (err) {
      return res.status(401).json({ error: "Token JWT invalide ou expiré" });
    }
  };
}

// Helper pour vérifier le rôle d'une route spécifique
export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `Accès refusé. Rôle ${role} requis.` });
    }
    next();
  };
}
