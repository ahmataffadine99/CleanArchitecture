"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gestionnaireErreurs = gestionnaireErreurs;
const domain_1 = require("@ecoeats/domain");
// Mappe les erreurs métier vers des codes HTTP appropriés
const codesHttp = {
    PANIER_CONFLIT_RESTAURANT: 409,
    PLAT_EN_RUPTURE: 409,
    IDENTIFIANTS_INVALIDES: 401,
    EMAIL_DEJA_UTILISE: 400,
    COMMANDE_INTROUVABLE: 404,
    RESTAURANT_INTROUVABLE: 404,
    CLIENT_INTROUVABLE: 404,
    PLAT_INTROUVABLE: 404,
    AUCUN_LIVREUR_DISPONIBLE: 503,
    TRANSITION_STATUT_INVALIDE: 422,
};
function gestionnaireErreurs(err, req, res, next) {
    if (err instanceof domain_1.ErreurMetier) {
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
//# sourceMappingURL=gestionnaireErreurs.js.map