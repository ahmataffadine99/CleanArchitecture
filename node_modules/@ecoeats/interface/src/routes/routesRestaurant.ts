import { Router, Request, Response, NextFunction } from "express";
import {
  AjouterPlatUseCase,
  ModifierPlatUseCase,
  SupprimerPlatUseCase,
  AccepterCommandeUseCase,
  RefuserCommandeUseCase,
  MarquerCommandePreteUseCase,
} from "@ecoeats/application";

export function creerRoutesRestaurant(deps: {
  ajouterPlat: AjouterPlatUseCase;
  modifierPlat: ModifierPlatUseCase;
  supprimerPlat: SupprimerPlatUseCase;
  accepterCommande: AccepterCommandeUseCase;
  refuserCommande: RefuserCommandeUseCase;
  marquerPrete: MarquerCommandePreteUseCase;
}): Router {
  const router = Router();

  // POST /restaurant/:id/plats
  router.post("/restaurant/:id/plats", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plat = await deps.ajouterPlat.executer({ restaurantId: req.params.id, ...req.body });
      res.status(201).json({ id: plat.id, nom: plat.nom, prix: plat.prix.enEuros() });
    } catch (err) { next(err); }
  });

  // PATCH /plats/:id
  router.patch("/plats/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deps.modifierPlat.executer({ platId: req.params.id, ...req.body });
      res.status(204).send();
    } catch (err) { next(err); }
  });

  // DELETE /plats/:id
  router.delete("/plats/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deps.supprimerPlat.executer(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  });

  // POST /commandes/:id/accepter
  router.post("/commandes/:id/accepter", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commande = await deps.accepterCommande.executer({
        commandeId: req.params.id,
        tempsPreparationMinutes: req.body.tempsPreparationMinutes,
      });
      res.json({ statut: commande.getStatut(), tempsPreparation: commande.getTempsPreparation() });
    } catch (err) { next(err); }
  });

  // POST /commandes/:id/refuser
  router.post("/commandes/:id/refuser", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commande = await deps.refuserCommande.executer(req.params.id);
      res.json({ statut: commande.getStatut() });
    } catch (err) { next(err); }
  });

  // POST /commandes/:id/prete
  router.post("/commandes/:id/prete", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commande = await deps.marquerPrete.executer(req.params.id);
      res.json({ statut: commande.getStatut() });
    } catch (err) { next(err); }
  });

  return router;
}
