import { Router, Request, Response, NextFunction } from "express";
import { InscriptionUseCase, ConnexionUseCase } from "@ecoeats/application";

export function creerRoutesAuth(deps: {
  inscription: InscriptionUseCase;
  connexion: ConnexionUseCase;
}): Router {
  const router = Router();

  router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nom, email, motDePasse, role, adresse, latitude, longitude, telephone } = req.body;
      const resultat = await deps.inscription.executer({ nom, email, motDePasse, role, adresse, latitude, longitude, telephone });
      res.status(201).json(resultat);
    } catch (err) { next(err); }
  });

  router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, motDePasse } = req.body;
      const resultat = await deps.connexion.executer({ email, motDePasse });
      res.json(resultat);
    } catch (err) { next(err); }
  });

  return router;
}
