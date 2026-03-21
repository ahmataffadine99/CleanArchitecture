import { Router, Request, Response, NextFunction } from "express";
import {
  AjouterPlatUseCase,
  ModifierPlatUseCase,
  SupprimerPlatUseCase,
  AccepterCommandeUseCase,
  RefuserCommandeUseCase,
  MarquerCommandePreteUseCase,
  ListerCommandesRestaurantUseCase,
  ModifierRestaurantUseCase,
  ObtenirMonRestaurantUseCase,
  AjouterAuPanierUseCase, // On réutilise son service in-memory pour voir les paniers
} from "@ecoeats/application";
import { requireRole } from "../middleware/authMiddleware";

export function creerRoutesRestaurant(deps: {
  ajouterPlat: AjouterPlatUseCase;
  modifierPlat: ModifierPlatUseCase;
  supprimerPlat: SupprimerPlatUseCase;
  accepterCommande: AccepterCommandeUseCase;
  refuserCommande: RefuserCommandeUseCase;
  marquerPrete: MarquerCommandePreteUseCase;
  listerCommandes: ListerCommandesRestaurantUseCase;
  modifierRestaurant: ModifierRestaurantUseCase;
  obtenirMonResto: ObtenirMonRestaurantUseCase;
  servicePanier: AjouterAuPanierUseCase; 
}): Router {
  const router = Router();

  // GET /restaurant/mon-restaurant (RESTAURATEUR Uniquement)
  router.get("/restaurant/mon-restaurant", async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.profilId) {
        return res.status(401).json({ error: "Non connecté" });
      }
      const restaurant = await deps.obtenirMonResto.executer(req.user.profilId);
      if (!restaurant) {
        return res.status(404).json({ error: "Aucun restaurant trouvé pour ce propriétaire" });
      }
      res.json(restaurant);
    } catch (err) { next(err); }
  });

  // GET /restaurant/:id/commandes
  router.get("/restaurant/:id/commandes", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commandes = await deps.listerCommandes.executer(req.params.id);
      res.json(commandes.map((c: any) => {
        // Handle both Commande instances (if DepotClients wasn't injected) and plain objects
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
          articles: (isPlain ? c.articles : c.getArticles()).map((a: any) => ({
            id: a.menuItemId,
            nom: a.nom,
            quantite: a.quantite,
            prixCentimes: typeof a.prixSnapshot.enCentimes === 'function' ? a.prixSnapshot.enCentimes() : a.prixSnapshot,
            restaurantId: a.restaurantId
          }))
        };
      }));
    } catch (err) { next(err); }
  });

  // GET /restaurant/:id/paniers-actifs
  router.get("/restaurant/:id/paniers-actifs", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paniers = deps.servicePanier.getTousLesPaniersParRestaurant(req.params.id);
      res.json(paniers.map((p: any) => ({
        clientId: p.clientId,
        total: p.prixTotal().enEuros(),
        articles: p.getArticles().map((a: any) => ({
          nom: a.nom,
          quantite: a.quantite
        }))
      })));
    } catch (err) { next(err); }
  });

  // PATCH /restaurant/:id (Restaurateur Uniquement — Profil)
  router.patch("/restaurant/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deps.modifierRestaurant.executer({ restaurantId: req.params.id, ...req.body });
      res.status(204).send();
    } catch (err) { next(err); }
  });

  // POST /restaurant/:id/plats (Restaurateur Uniquement)
  router.post("/restaurant/:id/plats", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plat = await deps.ajouterPlat.executer({ restaurantId: req.params.id, ...req.body });
      res.status(201).json({ id: plat.id, nom: plat.nom, prix: plat.prix.enEuros(), imageUrl: plat.imageUrl });
    } catch (err) { next(err); }
  });

  // PATCH /plats/:id (Restaurateur Uniquement)
  router.patch("/plats/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deps.modifierPlat.executer({ platId: req.params.id, ...req.body });
      res.status(204).send();
    } catch (err) { next(err); }
  });

  // DELETE /plats/:id (Restaurateur Uniquement)
  router.delete("/plats/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deps.supprimerPlat.executer(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  });

  // POST /commandes/:id/accepter (Restaurateur Uniquement)
  router.post("/commandes/:id/accepter", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commande = await deps.accepterCommande.executer({
        commandeId: req.params.id,
        tempsPreparationMinutes: req.body.tempsPreparationMinutes,
      });
      res.json({ statut: commande.getStatut(), tempsPreparation: commande.getTempsPreparation() });
    } catch (err) { next(err); }
  });

  // POST /commandes/:id/refuser (Restaurateur Uniquement)
  router.post("/commandes/:id/refuser", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commande = await deps.refuserCommande.executer(req.params.id);
      res.json({ statut: commande.getStatut() });
    } catch (err) { next(err); }
  });

  // POST /commandes/:id/prete (Restaurateur Uniquement)
  router.post("/commandes/:id/prete", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commande = await deps.marquerPrete.executer(req.params.id);
      res.json({ statut: commande.getStatut() });
    } catch (err) { next(err); }
  });

  return router;
}
