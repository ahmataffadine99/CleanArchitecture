"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creerRoutesClient = creerRoutesClient;
const express_1 = require("express");
function creerRoutesClient(deps) {
    const router = (0, express_1.Router)();
    router.get("/restaurants", async (req, res, next) => {
        try {
            const restaurants = await deps.listerRestaurants.executer();
            res.json(restaurants.map(r => ({
                id: r.id, nom: r.nom, adresse: r.adresse,
                position: { lat: r.position.latitude, lon: r.position.longitude },
            })));
        }
        catch (err) {
            next(err);
        }
    });
    router.get("/restaurants/:id/menu", async (req, res, next) => {
        try {
            const { disponibles, rupture } = await deps.voirMenu.executer(req.params.id);
            const formater = (p) => ({
                id: p.id, nom: p.nom, description: p.description,
                prix: p.prix.enEuros(), allergenes: p.allergenes, stock: p.stockJournalier,
                imageUrl: p.imageUrl,
                actif: p.actif,
                categorie: p.categorie,
            });
            const actifsSeulement = (p) => p.actif !== false;
            res.json({
                disponibles: disponibles.filter(actifsSeulement).map(formater),
                rupture: rupture.filter(actifsSeulement).map(formater)
            });
        }
        catch (err) {
            next(err);
        }
    });
    router.post("/panier/articles", async (req, res, next) => {
        try {
            const { clientId, platId, quantite } = req.body;
            const panier = await deps.ajouterAuPanier.executer({ clientId, platId, quantite });
            res.status(201).json({
                restaurantId: panier.getRestaurantId(),
                articles: panier.getArticles().map(a => ({
                    platId: a.menuItemId, nom: a.nom,
                    prix: a.prixSnapshot.enEuros(), quantite: a.quantite,
                })),
                total: panier.prixTotal().enEuros(),
            });
        }
        catch (err) {
            next(err);
        }
    });
    router.delete("/panier/:clientId", (req, res) => {
        deps.ajouterAuPanier.viderPanier(req.params.clientId);
        res.status(204).send();
    });
    router.delete("/panier/:clientId/articles/:platId", (req, res) => {
        deps.ajouterAuPanier.retirerDuPanier(req.params.clientId, req.params.platId);
        res.status(204).send();
    });
    router.post("/commandes", async (req, res, next) => {
        try {
            const { clientId, adresseLivraison, latitude, longitude } = req.body;
            const panier = deps.ajouterAuPanier.getPanier(clientId);
            if (!panier || panier.estVide()) {
                return res.status(400).json({ message: "Le panier est vide." });
            }
            const commande = await deps.passerCommande.executer({ clientId, panier, adresseLivraison, latitude, longitude });
            res.status(201).json({
                id: commande.id, statut: commande.getStatut(),
                total: commande.prixTotal().enEuros(),
                detail: {
                    plats: commande.getPrixPlats().enEuros(),
                    livraison: commande.getFraisLivraison().enEuros(),
                    service: commande.getFraisService().enEuros(),
                },
            });
        }
        catch (err) {
            next(err);
        }
    });
    router.post("/commandes/:id/payer", async (req, res, next) => {
        try {
            const { clientId } = req.body;
            const { facture } = await deps.payerCommande.executer({ commandeId: req.params.id, clientId });
            res.json({ factureId: facture.id, total: facture.total.enEuros(), detail: facture.afficher() });
        }
        catch (err) {
            next(err);
        }
    });
    router.get("/clients/:clientId/commandes", async (req, res, next) => {
        try {
            const commandes = await deps.listerCommandesClient.executer(req.params.clientId);
            res.json(commandes.map((c) => {
                const isPlain = typeof c.getStatut !== 'function';
                return {
                    id: c.id,
                    restaurantId: c.restaurantId,
                    restaurantNom: c.restaurantNom,
                    livreurNom: c.livreurNom,
                    statut: isPlain ? c.statut : c.getStatut(),
                    prixPlatsCentimes: isPlain ? (c.prixPlatsCentimes ?? 0) : c.getPrixPlats().enCentimes(),
                    fraisLivCentimes: isPlain ? (c.fraisLivCentimes ?? 0) : c.getFraisLivraison().enCentimes(),
                    fraisServiceCentimes: isPlain ? (c.fraisServiceCentimes ?? 0) : c.getFraisService().enCentimes(),
                    totalCentimes: isPlain ? (c.totalCentimes ?? (c.prixTotal * 100)) : c.prixTotal().enCentimes(),
                    creeLe: isPlain ? c.creeLe : c.getCreeLe(),
                    tempsPreparationEstime: isPlain ? c.tempsPreparationEstime : c.getTempsPreparation(),
                    adresseLivraison: isPlain ? c.adresseLivraison : c.getAdresseLivraison(),
                    articles: (isPlain ? c.articles : c.getArticles()).map((a) => ({
                        nom: a.nom,
                        quantite: a.quantite
                    }))
                };
            }));
        }
        catch (err) {
            next(err);
        }
    });
    router.get("/clients/:clientId/points", async (req, res, next) => {
        try {
            const clientId = req.params.clientId;
            const commandes = await deps.listerCommandesClient.executer(clientId);
            const totalPoints = commandes
                .filter((c) => {
                const s = typeof c.getStatut === 'function' ? c.getStatut() : c.statut;
                return ['PAYEE', 'ACCEPTEE', 'EN_PREPARATION', 'PRETE', 'EN_LIVRAISON', 'LIVREE'].includes(s);
            })
                .reduce((sum, c) => {
                const isPlain = typeof c.prixTotal !== 'function';
                const totalCentimes = isPlain ? (c.totalCentimes ?? (c.prixTotal * 100)) : c.prixTotal().enCentimes();
                return sum + Math.floor(totalCentimes / 100);
            }, 0);
            res.json({ pointsFidelite: totalPoints });
        }
        catch (err) {
            next(err);
        }
    });
    router.get('/favoris/restaurants/:clientId', async (req, res, next) => {
        try {
            const ids = await deps.gererFavoris.listerRestaurants(req.params.clientId);
            res.json(ids);
        }
        catch (err) {
            next(err);
        }
    });
    router.post('/favoris/restaurants', async (req, res, next) => {
        try {
            await deps.gererFavoris.ajouterRestaurant(req.body.clientId, req.body.restaurantId);
            res.status(201).send();
        }
        catch (err) {
            next(err);
        }
    });
    router.delete('/favoris/restaurants/:clientId/:restaurantId', async (req, res, next) => {
        try {
            await deps.gererFavoris.retirerRestaurant(req.params.clientId, req.params.restaurantId);
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    });
    router.get('/favoris/plats/:clientId', async (req, res, next) => {
        try {
            const ids = await deps.gererFavoris.listerPlats(req.params.clientId);
            res.json(ids);
        }
        catch (err) {
            next(err);
        }
    });
    router.post('/favoris/plats', async (req, res, next) => {
        try {
            await deps.gererFavoris.ajouterPlat(req.body.clientId, req.body.platId);
            res.status(201).send();
        }
        catch (err) {
            next(err);
        }
    });
    router.delete('/favoris/plats/:clientId/:platId', async (req, res, next) => {
        try {
            await deps.gererFavoris.retirerPlat(req.params.clientId, req.params.platId);
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    });
    router.post("/commandes/:id/avis", async (req, res, next) => {
        try {
            const { note, commentaire } = req.body;
            await deps.laisserAvis.executer({ commandeId: req.params.id, note, commentaire });
            res.status(201).send();
        }
        catch (err) {
            next(err);
        }
    });
    return router;
}