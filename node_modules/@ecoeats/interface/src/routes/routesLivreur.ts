import { Router, Request, Response, NextFunction } from "express";
import {
  ChangerStatutLivreurUseCase,
  AttribuerLivraisonUseCase,
  TerminerLivraisonUseCase,
} from "@ecoeats/application";

export function creerRoutesLivreur(deps: {
  changerStatut: ChangerStatutLivreurUseCase;
  attribuerLivraison: AttribuerLivraisonUseCase;
  terminerLivraison: TerminerLivraisonUseCase;
}): Router {
  const router = Router();

  // PATCH /livreurs/:id/statut
  router.patch("/livreurs/:id/statut", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const livreur = await deps.changerStatut.executer({
        livreurId: req.params.id,
        statut: req.body.statut,
      });
      res.json({ statut: livreur.getStatut() });
    } catch (err) { next(err); }
  });

  // POST /commandes/:id/attribuer-livreur
  router.post("/commandes/:id/attribuer-livreur", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { commande, livreur } = await deps.attribuerLivraison.executer({ commandeId: req.params.id });
      res.json({
        livreurId: livreur.id,
        livreurNom: livreur.nom,
        statutCommande: commande.getStatut(),
      });
    } catch (err) { next(err); }
  });

  // POST /commandes/:id/livree
  router.post("/commandes/:id/livree", async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (err) { next(err); }
  });

  return router;
}
