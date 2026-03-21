"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creerRoutesLivreur = creerRoutesLivreur;
const express_1 = require("express");
function creerRoutesLivreur(deps) {
    const router = (0, express_1.Router)();
    // GET /livreurs/:id/propositions
    router.get("/livreurs/:id/propositions", async (req, res, next) => {
        try {
            const details = await deps.obtenirPropositions.executer(req.params.id);
            res.json(details);
        }
        catch (err) {
            next(err);
        }
    });
    // GET /livreurs/:id/historique
    router.get("/livreurs/:id/historique", async (req, res, next) => {
        try {
            const historique = await deps.listerHistorique.executer(req.params.id);
            res.json(historique);
        }
        catch (err) {
            next(err);
        }
    });
    // GET /livreurs/:id/avis
    router.get("/livreurs/:id/avis", async (req, res, next) => {
        try {
            const avis = await deps.obtenirAvis.executer(req.params.id);
            res.json(avis);
        }
        catch (err) {
            next(err);
        }
    });
    // GET /livreurs/:id
    router.get("/livreurs/:id", async (req, res, next) => {
        try {
            const livreur = await deps.obtenirLivreur.executer(req.params.id);
            res.json({
                id: livreur.id,
                nom: livreur.nom,
                telephone: livreur.telephone,
                statut: livreur.getStatut(),
                portefeuille: livreur.getPortefeuille().enEuros(),
                estExpert: livreur.estExpert,
                commandesEnCoursIds: livreur.getCommandesEnCoursIds()
            });
        }
        catch (err) {
            next(err);
        }
    });
    // PATCH /livreurs/:id/statut
    router.patch("/livreurs/:id/statut", async (req, res, next) => {
        try {
            const livreur = await deps.changerStatut.executer({
                livreurId: req.params.id,
                statut: req.body.statut,
            });
            res.json({ statut: livreur.getStatut() });
        }
        catch (err) {
            next(err);
        }
    });
    // POST /commandes/:id/attribuer-livreur
    router.post("/commandes/:id/attribuer-livreur", async (req, res, next) => {
        try {
            const { commande, livreur } = await deps.attribuerLivraison.executer({ commandeId: req.params.id });
            res.json({
                livreurId: livreur.id,
                livreurNom: livreur.nom,
                statutCommande: commande.getStatut(),
            });
        }
        catch (err) {
            next(err);
        }
    });
    // POST /commandes/:id/livree
    router.post("/commandes/:id/livree", async (req, res, next) => {
        try {
            const { livreur, gains } = await deps.terminerLivraison.executer({
                commandeId: req.params.id,
                livreurId: req.body.livreurId,
                pourboire: req.body.pourboire,
            });
            res.json({
                message: "Livraison terminée !",
                gains: gains.enEuros(),
                portefeuille: livreur.getPortefeuille().enEuros(),
            });
        }
        catch (err) {
            next(err);
        }
    });
    // POST /livreurs/:id/propositions/:commandeId/accepter
    router.post("/livreurs/:id/propositions/:commandeId/accepter", async (req, res, next) => {
        try {
            await deps.accepterLivraison.executer({
                livreurId: req.params.id,
                commandeId: req.params.commandeId,
            });
            res.status(204).send();
        }
        catch (err) {
            console.error("Erreur Acceptation:", err.message);
            res.status(400).json({ error: err.message });
        }
    });
    // POST /livreurs/:id/propositions/:commandeId/refuser
    router.post("/livreurs/:id/propositions/:commandeId/refuser", async (req, res, next) => {
        try {
            await deps.refuserLivraison.executer({
                livreurId: req.params.id,
                commandeId: req.params.commandeId,
            });
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    });
    // POST /commandes/:id/recuperer
    router.post("/commandes/:id/recuperer", async (req, res, next) => {
        try {
            await deps.recupererCommande.executer({
                commandeId: req.params.id,
                livreurId: req.body.livreurId,
            });
            res.json({ message: "Commande récupérée !" });
        }
        catch (err) {
            next(err);
        }
    });
    // GET /commandes/:id
    router.get("/commandes/:id", async (req, res, next) => {
        try {
            const commande = await deps.obtenirCommande.executer(req.params.id);
            res.json(commande);
        }
        catch (err) {
            next(err);
        }
    });
    return router;
}
//# sourceMappingURL=routesLivreur.js.map