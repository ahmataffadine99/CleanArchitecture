"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creerRoutesRestaurant = creerRoutesRestaurant;
const express_1 = require("express");
function creerRoutesRestaurant(deps) {
    const router = (0, express_1.Router)();
    router.get("/restaurant/mon-restaurant", async (req, res, next) => {
        try {
            if (!req.user || !req.user.profilId) {
                return res.status(401).json({ error: "Non connecté" });
            }
            const restaurant = await deps.obtenirMonResto.executer(req.user.profilId);
            if (!restaurant) {
                return res.status(404).json({ error: "Aucun restaurant trouvé pour ce propriétaire" });
            }
            res.json(restaurant);
        }
        catch (err) {
            next(err);
        }
    });
    router.get("/restaurant/:id/commandes", async (req, res, next) => {
        try {
            const commandes = await deps.listerCommandes.executer(req.params.id);
            res.json(commandes.map((c) => {
                const isPlain = typeof c.getStatut !== 'function';
                return {
                    id: c.id,
                    restaurantId: c.restaurantId,
                    statut: isPlain ? c.statut : c.getStatut(),
                    prixPlatsCentimes: isPlain ? c.prixPlatsCentimes : c.getPrixPlats().enCentimes(),
                    creeLe: isPlain ? c.creeLe : c.getCreeLe(),
                    clientNom: c.clientNom,
                    clientTelephone: c.clientTelephone,
                    adresseLivraison: isPlain ? c.adresseLivraison : c.getAdresseLivraison(),
                    livreurNom: c.livreurNom,
                    articles: (isPlain ? c.articles : c.getArticles()).map((a) => ({
                        id: a.menuItemId,
                        nom: a.nom,
                        quantite: a.quantite,
                        prixCentimes: typeof a.prixSnapshot.enCentimes === 'function' ? a.prixSnapshot.enCentimes() : a.prixSnapshot,
                        restaurantId: a.restaurantId
                    }))
                };
            }));
        }
        catch (err) {
            next(err);
        }
    });
    router.get("/restaurant/:id/paniers-actifs", async (req, res, next) => {
        try {
            const paniers = deps.servicePanier.getTousLesPaniersParRestaurant(req.params.id);
            res.json(paniers.map((p) => ({
                clientId: p.clientId,
                total: p.prixTotal().enEuros(),
                articles: p.getArticles().map((a) => ({
                    nom: a.nom,
                    quantite: a.quantite
                }))
            })));
        }
        catch (err) {
            next(err);
        }
    });
    router.patch("/restaurant/:id", async (req, res, next) => {
        try {
            await deps.modifierRestaurant.executer({ restaurantId: req.params.id, ...req.body });
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    });
    router.post("/restaurant/:id/plats", async (req, res, next) => {
        try {
            const plat = await deps.ajouterPlat.executer({ restaurantId: req.params.id, ...req.body });
            res.status(201).json({ id: plat.id, nom: plat.nom, prix: plat.prix.enEuros(), imageUrl: plat.imageUrl, categorie: plat.categorie });
        }
        catch (err) {
            next(err);
        }
    });
    router.patch("/plats/:id", async (req, res, next) => {
        try {
            await deps.modifierPlat.executer({ platId: req.params.id, ...req.body });
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    });
    router.delete("/plats/:id", async (req, res, next) => {
        try {
            await deps.supprimerPlat.executer(req.params.id);
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    });
    router.post("/commandes/:id/accepter", async (req, res, next) => {
        try {
            const commande = await deps.accepterCommande.executer({
                commandeId: req.params.id,
                tempsPreparationMinutes: req.body.tempsPreparationMinutes,
            });
            res.json({ statut: commande.getStatut(), tempsPreparation: commande.getTempsPreparation() });
        }
        catch (err) {
            next(err);
        }
    });
    router.post("/commandes/:id/refuser", async (req, res, next) => {
        try {
            const commande = await deps.refuserCommande.executer(req.params.id);
            res.json({ statut: commande.getStatut() });
        }
        catch (err) {
            next(err);
        }
    });
    router.post("/commandes/:id/prete", async (req, res, next) => {
        try {
            const commande = await deps.marquerPrete.executer(req.params.id);
            res.json({ statut: commande.getStatut() });
        }
        catch (err) {
            next(err);
        }
    });
    return router;
}