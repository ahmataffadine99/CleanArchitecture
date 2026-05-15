import { ErreurMetier } from "@ecoeats/domain";
import { Request, Response, NextFunction } from "express";

const codesHttp: Record<string, number> = {
  PANIER_CONFLIT_RESTAURANT: 409,
  PLAT_EN_RUPTURE: 409,
  IDENTIFIANTS_INVALIDES: 401,
  EMAIL_DEJA_UTILISE: 400,
  COMMANDE_INTROUVABLE: 404,
  RESTAURANT_INTROUVABLE: 404,
  CLIENT_INTROUVABLE: 404,
  PLAT_INTROUVABLE: 404,
  COMPTE_SUSPENDU: 403,
  AUCUN_LIVREUR_DISPONIBLE: 503,
  TRANSITION_STATUT_INVALIDE: 422,
};

export function gestionnaireErreurs(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ErreurMetier) {
    const statut = codesHttp[err.code] ?? 400;
    res.status(statut).json({
      code: err.code,
      message: err.message,
    });
    return;
  }

  console.error("[Erreur inattendue]", err);
  res.status(500).json({ code: "ERREUR_INTERNE", message: "Une erreur inattendue s'est produite." });
}
