var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  creerRoutesClient: () => creerRoutesClient,
  creerRoutesLivreur: () => creerRoutesLivreur,
  creerRoutesRestaurant: () => creerRoutesRestaurant,
  gestionnaireErreurs: () => gestionnaireErreurs
});
module.exports = __toCommonJS(index_exports);

// src/routes/routesClient.ts
var import_express = require("express");
function creerRoutesClient(deps) {
  const router = (0, import_express.Router)();
  router.get("/restaurants", async (req, res, next) => {
    try {
      const restaurants = await deps.listerRestaurants.executer();
      res.json(restaurants.map((r) => ({
        id: r.id,
        nom: r.nom,
        adresse: r.adresse,
        position: { lat: r.position.latitude, lon: r.position.longitude }
      })));
    } catch (err) {
      next(err);
    }
  });
  router.get("/restaurants/:id/menu", async (req, res, next) => {
    try {
      const { disponibles, rupture } = await deps.voirMenu.executer(req.params.id);
      const formater = (p) => ({
        id: p.id,
        nom: p.nom,
        description: p.description,
        prix: p.prix.enEuros(),
        allergenes: p.allergenes,
        stock: p.stockJournalier
      });
      res.json({ disponibles: disponibles.map(formater), rupture: rupture.map(formater) });
    } catch (err) {
      next(err);
    }
  });
  router.post("/panier/articles", async (req, res, next) => {
    try {
      const { clientId, platId, quantite } = req.body;
      const panier = await deps.ajouterAuPanier.executer({ clientId, platId, quantite });
      res.status(201).json({
        restaurantId: panier.getRestaurantId(),
        articles: panier.getArticles().map((a) => ({
          platId: a.menuItemId,
          nom: a.nom,
          prix: a.prixSnapshot.enEuros(),
          quantite: a.quantite
        })),
        total: panier.prixTotal().enEuros()
      });
    } catch (err) {
      next(err);
    }
  });
  router.delete("/panier/:clientId", (req, res) => {
    deps.ajouterAuPanier.viderPanier(req.params.clientId);
    res.status(204).send();
  });
  router.post("/commandes", async (req, res, next) => {
    try {
      const { clientId, adresseLivraison } = req.body;
      const panier = deps.ajouterAuPanier.getPanier(clientId);
      if (!panier || panier.estVide()) {
        return res.status(400).json({ message: "Le panier est vide." });
      }
      const commande = await deps.passerCommande.executer({ clientId, panier, adresseLivraison });
      res.status(201).json({
        id: commande.id,
        statut: commande.getStatut(),
        total: commande.prixTotal().enEuros(),
        detail: {
          plats: commande.getPrixPlats().enEuros(),
          livraison: commande.getFraisLivraison().enEuros(),
          service: commande.getFraisService().enEuros()
        }
      });
    } catch (err) {
      next(err);
    }
  });
  router.post("/commandes/:id/payer", async (req, res, next) => {
    try {
      const { clientId } = req.body;
      const { facture } = await deps.payerCommande.executer({ commandeId: req.params.id, clientId });
      res.json({ factureId: facture.id, total: facture.total.enEuros(), detail: facture.afficher() });
    } catch (err) {
      next(err);
    }
  });
  return router;
}

// src/routes/routesRestaurant.ts
var import_express2 = require("express");
function creerRoutesRestaurant(deps) {
  const router = (0, import_express2.Router)();
  router.post("/restaurant/:id/plats", async (req, res, next) => {
    try {
      const plat = await deps.ajouterPlat.executer({ restaurantId: req.params.id, ...req.body });
      res.status(201).json({ id: plat.id, nom: plat.nom, prix: plat.prix.enEuros() });
    } catch (err) {
      next(err);
    }
  });
  router.patch("/plats/:id", async (req, res, next) => {
    try {
      await deps.modifierPlat.executer({ platId: req.params.id, ...req.body });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });
  router.delete("/plats/:id", async (req, res, next) => {
    try {
      await deps.supprimerPlat.executer(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });
  router.post("/commandes/:id/accepter", async (req, res, next) => {
    try {
      const commande = await deps.accepterCommande.executer({
        commandeId: req.params.id,
        tempsPreparationMinutes: req.body.tempsPreparationMinutes
      });
      res.json({ statut: commande.getStatut(), tempsPreparation: commande.getTempsPreparation() });
    } catch (err) {
      next(err);
    }
  });
  router.post("/commandes/:id/refuser", async (req, res, next) => {
    try {
      const commande = await deps.refuserCommande.executer(req.params.id);
      res.json({ statut: commande.getStatut() });
    } catch (err) {
      next(err);
    }
  });
  router.post("/commandes/:id/prete", async (req, res, next) => {
    try {
      const commande = await deps.marquerPrete.executer(req.params.id);
      res.json({ statut: commande.getStatut() });
    } catch (err) {
      next(err);
    }
  });
  return router;
}

// src/routes/routesLivreur.ts
var import_express3 = require("express");
function creerRoutesLivreur(deps) {
  const router = (0, import_express3.Router)();
  router.patch("/livreurs/:id/statut", async (req, res, next) => {
    try {
      const livreur = await deps.changerStatut.executer({
        livreurId: req.params.id,
        statut: req.body.statut
      });
      res.json({ statut: livreur.getStatut() });
    } catch (err) {
      next(err);
    }
  });
  router.post("/commandes/:id/attribuer-livreur", async (req, res, next) => {
    try {
      const { commande, livreur } = await deps.attribuerLivraison.executer({ commandeId: req.params.id });
      res.json({
        livreurId: livreur.id,
        livreurNom: livreur.nom,
        statutCommande: commande.getStatut()
      });
    } catch (err) {
      next(err);
    }
  });
  router.post("/commandes/:id/livree", async (req, res, next) => {
    try {
      const { livreur, gains } = await deps.terminerLivraison.executer({
        commandeId: req.params.id,
        livreurId: req.body.livreurId,
        pourboire: req.body.pourboire
      });
      res.json({
        message: "Livraison termin\xE9e !",
        gains: gains.enEuros(),
        portefeuille: livreur.getPortefeuille().enEuros()
      });
    } catch (err) {
      next(err);
    }
  });
  return router;
}

// src/middleware/gestionnaireErreurs.ts
var import_domain = require("@ecoeats/domain");
var codesHttp = {
  PANIER_CONFLIT_RESTAURANT: 409,
  PLAT_EN_RUPTURE: 409,
  COMMANDE_INTROUVABLE: 404,
  RESTAURANT_INTROUVABLE: 404,
  CLIENT_INTROUVABLE: 404,
  PLAT_INTROUVABLE: 404,
  AUCUN_LIVREUR_DISPONIBLE: 503,
  TRANSITION_STATUT_INVALIDE: 422
};
function gestionnaireErreurs(err, req, res, next) {
  if (err instanceof import_domain.ErreurMetier) {
    const statut = codesHttp[err.code] ?? 400;
    res.status(statut).json({
      code: err.code,
      message: err.message
    });
    return;
  }
  console.error("[Erreur inattendue]", err);
  res.status(500).json({ code: "ERREUR_INTERNE", message: "Une erreur inattendue s'est produite." });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  creerRoutesClient,
  creerRoutesLivreur,
  creerRoutesRestaurant,
  gestionnaireErreurs
});
