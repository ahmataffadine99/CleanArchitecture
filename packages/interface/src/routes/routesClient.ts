import { Router, Request, Response, NextFunction } from "express";
import {
  ListerRestaurantsUseCase,
  VoirMenuRestaurantUseCase,
  AjouterAuPanierUseCase,
  PasserCommandeUseCase,
  PayerCommandeUseCase,
} from "@ecoeats/application";

export function creerRoutesClient(deps: {
  listerRestaurants: ListerRestaurantsUseCase;
  voirMenu: VoirMenuRestaurantUseCase;
  ajouterAuPanier: AjouterAuPanierUseCase;
  passerCommande: PasserCommandeUseCase;
  payerCommande: PayerCommandeUseCase;
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
      });
      res.json({ disponibles: disponibles.map(formater), rupture: rupture.map(formater) });
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

  return router;
}
