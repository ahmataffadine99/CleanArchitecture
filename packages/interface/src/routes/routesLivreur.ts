import { Router, Request, Response, NextFunction } from "express";
import {
  ChangerStatutLivreurUseCase,
  AttribuerLivraisonUseCase,
  TerminerLivraisonUseCase,
  ObtenirLivreurUseCase,
  AccepterLivraisonUseCase,
  RefuserLivraisonUseCase,
  ObtenirPropositionsLivreurUseCase,
  RecupererCommandeUseCase,
  ObtenirCommandeUseCase,
  ListerHistoriqueLivreurUseCase,
  ObtenirAvisLivreurUseCase,
} from "@ecoeats/application";

export function creerRoutesLivreur(deps: {
  changerStatut: ChangerStatutLivreurUseCase;
  attribuerLivraison: AttribuerLivraisonUseCase;
  terminerLivraison: TerminerLivraisonUseCase;
  obtenirLivreur: ObtenirLivreurUseCase;
  accepterLivraison: AccepterLivraisonUseCase;
  refuserLivraison: RefuserLivraisonUseCase;
  obtenirPropositions: ObtenirPropositionsLivreurUseCase;
  recupererCommande: RecupererCommandeUseCase;
  obtenirCommande: ObtenirCommandeUseCase;
  listerHistorique: ListerHistoriqueLivreurUseCase;
  obtenirAvis: ObtenirAvisLivreurUseCase;
}): Router {
  const router = Router();

  router.get("/livreurs/:id/propositions", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const details = await deps.obtenirPropositions.executer(req.params.id);
      res.json(details);
    } catch (err) { next(err); }
  });

  router.get("/livreurs/:id/historique", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const historique = await deps.listerHistorique.executer(req.params.id);
      res.json(historique);
    } catch (err) { next(err); }
  });

  router.get("/livreurs/:id/avis", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const avis = await deps.obtenirAvis.executer(req.params.id);
      res.json(avis);
    } catch (err) { next(err); }
  });

  router.get("/livreurs/:id", async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (err) { next(err); }
  });

  router.patch("/livreurs/:id/statut", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const livreur = await deps.changerStatut.executer({
        livreurId: req.params.id,
        statut: req.body.statut,
      });
      res.json({ statut: livreur.getStatut() });
    } catch (err) { next(err); }
  });

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

  router.post("/livreurs/:id/propositions/:commandeId/accepter", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deps.accepterLivraison.executer({
        livreurId: req.params.id,
        commandeId: req.params.commandeId,
      });
      res.status(204).send();
    } catch (err: any) {
      console.error("Erreur Acceptation:", err.message);
      res.status(400).json({ error: err.message });
    }
  });

  router.post("/livreurs/:id/propositions/:commandeId/refuser", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deps.refuserLivraison.executer({
        livreurId: req.params.id,
        commandeId: req.params.commandeId,
      });
      res.status(204).send();
    } catch (err) { next(err); }
  });

  router.post("/commandes/:id/recuperer", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deps.recupererCommande.executer({
        commandeId: req.params.id,
        livreurId: req.body.livreurId,
      });
      res.json({ message: "Commande récupérée !" });
    } catch (err) { next(err); }
  });

  router.get("/commandes/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commande = await deps.obtenirCommande.executer(req.params.id);
      res.json(commande);
    } catch (err) { next(err); }
  });

  return router;
}
