"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creerRoutesAuth = creerRoutesAuth;
const express_1 = require("express");
function creerRoutesAuth(deps) {
    const router = (0, express_1.Router)();
    router.post("/register", async (req, res, next) => {
        try {
            const { nom, email, motDePasse, role, adresse, latitude, longitude, telephone } = req.body;
            const resultat = await deps.inscription.executer({ nom, email, motDePasse, role, adresse, latitude, longitude, telephone });
            res.status(201).json(resultat);
        }
        catch (err) {
            next(err);
        }
    });
    router.post("/login", async (req, res, next) => {
        try {
            const { email, motDePasse } = req.body;
            const resultat = await deps.connexion.executer({ email, motDePasse });
            res.json(resultat);
        }
        catch (err) {
            next(err);
        }
    });
    return router;
}