"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creerAuthMiddleware = creerAuthMiddleware;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function creerAuthMiddleware(secretJwt) {
    return function authMiddleware(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token JWT manquant ou mal formaté" });
        }
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secretJwt);
            req.user = {
                sub: decoded.sub,
                role: decoded.role,
                profilId: decoded.profilId,
                email: decoded.email,
            };
            next();
        }
        catch (err) {
            return res.status(401).json({ error: "Token JWT invalide ou expiré" });
        }
    };
}
function requireRole(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: `Accès refusé. Rôle ${role} requis.` });
        }
        next();
    };
}