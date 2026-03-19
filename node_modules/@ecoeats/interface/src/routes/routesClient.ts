import { Router, Request, Response, NextFunction } from "express";
import {
  ListerRestaurantsUseCase,
  VoirMenuRestaurantUseCase,
  AjouterAuPanierUseCase,
  PasserCommandeUseCase,
  PayerCommandeUseCase,
  ListerCommandesClientUseCase,
} from "@ecoeats/application";

export function creerRoutesClient(deps: {
  listerRestaurants: ListerRestaurantsUseCase;
  voirMenu: VoirMenuRestaurantUseCase;
  ajouterAuPanier: AjouterAuPanierUseCase;
  passerCommande: PasserCommandeUseCase;
  payerCommande: PayerCommandeUseCase;
  listerCommandesClient: ListerCommandesClientUseCase;
}): Router {
  const router = Router();

  // GET /restaurants
  router.get("/restaurants", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const restaurants = await deps.listerRestaurants.executer();
      res.json(restaurants.map(r => ({
        id: r.id, nom: r.nom, adresse: r.adresse,
        position: { lat: r.position.latitude, lon: r.position.longitude },
      })));
    } catch (err) { next(err); }
  });

  // GET /restaurants/:id/menu
  router.get("/restaurants/:id/menu", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { disponibles, rupture } = await deps.voirMenu.executer(req.params.id);
      const formater = (p: any) => ({
        id: p.id, nom: p.nom, description: p.description,
        prix: p.prix.enEuros(), allergenes: p.allergenes, stock: p.stockJournalier,
        imageUrl: p.imageUrl,
        actif: p.actif,
      });

      const actifsSeulement = (p: any) => p.actif !== false;

      res.json({ 
        disponibles: disponibles.filter(actifsSeulement).map(formater), 
        rupture: rupture.filter(actifsSeulement).map(formater) 
      });
    } catch (err) { next(err); }
  });

  // POST /panier/articles
  router.post("/panier/articles", async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (err) { next(err); }
  });

  // DELETE /panier/:clientId
  router.delete("/panier/:clientId", (req: Request, res: Response) => {
    deps.ajouterAuPanier.viderPanier(req.params.clientId);
    res.status(204).send();
  });

  // DELETE /panier/:clientId/articles/:platId
  router.delete("/panier/:clientId/articles/:platId", (req: Request, res: Response) => {
    deps.ajouterAuPanier.retirerDuPanier(req.params.clientId, req.params.platId);
    res.status(204).send();
  });

  // POST /commandes
  router.post("/commandes", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clientId, adresseLivraison } = req.body;
      const panier = deps.ajouterAuPanier.getPanier(clientId);
      if (!panier || panier.estVide()) {
        return res.status(400).json({ message: "Le panier est vide." });
      }
      const commande = await deps.passerCommande.executer({ clientId, panier, adresseLivraison });
      res.status(201).json({
        id: commande.id, statut: commande.getStatut(),
        total: commande.prixTotal().enEuros(),
        detail: {
          plats: commande.getPrixPlats().enEuros(),
          livraison: commande.getFraisLivraison().enEuros(),
          service: commande.getFraisService().enEuros(),
        },
      });
    } catch (err) { next(err); }
  });

  // POST /commandes/:id/payer
  router.post("/commandes/:id/payer", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clientId } = req.body;
      const { facture } = await deps.payerCommande.executer({ commandeId: req.params.id, clientId });
      res.json({ factureId: facture.id, total: facture.total.enEuros(), detail: facture.afficher() });
    } catch (err) { next(err); }
  });

  // GET /clients/:clientId/commandes
  router.get("/clients/:clientId/commandes", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commandes = await deps.listerCommandesClient.executer(req.params.clientId);
      res.json(commandes.map((c: any) => ({
        id: c.id,
        restaurantId: c.restaurantId,
        statut: c.getStatut(),
        prixPlatsCentimes: c.getPrixPlats().enCentimes(),
        fraisLivCentimes: c.getFraisLivraison().enCentimes(),
        fraisServiceCentimes: c.getFraisService().enCentimes(),
        totalCentimes: c.prixTotal().enCentimes(),
        creeLe: c.getCreeLe(),
        tempsPreparationEstime: c.getTempsPreparation(),
        adresseLivraison: c.getAdresseLivraison(),
        articles: c.getArticles().map((a: any) => ({
          nom: a.nom,
          quantite: a.quantite
        }))
      })));
    } catch (err) { next(err); }
  });

  // GET /clients/:clientId/points - Points de fidélité du client
  router.get("/clients/:clientId/points", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientId = req.params.clientId;
      const commandes = await deps.listerCommandesClient.executer(clientId);
      // Calculer le total de points depuis les commandes payées/terminées
      const totalPoints = commandes
        .filter((c: any) => ['PAYEE', 'ACCEPTEE', 'EN_PREPARATION', 'PRETE', 'LIVREE'].includes(typeof c.getStatut === 'function' ? c.getStatut() : c.statut))
        .reduce((sum: number, c: any) => {
          const total = typeof c.prixTotal === 'function' ? c.prixTotal().enCentimes() : (c.totalCentimes ?? 0);
          return sum + Math.floor(total / 100);
        }, 0);
      res.json({ pointsFidelite: totalPoints });
    } catch (err) { next(err); }
  });

  return router;
}
