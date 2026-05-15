"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatutCommande = void 0;
exports.transitionAutorisee = transitionAutorisee;
var StatutCommande;
(function (StatutCommande) {
    StatutCommande["EN_ATTENTE"] = "EN_ATTENTE";
    StatutCommande["PAYEE"] = "PAYEE";
    StatutCommande["ACCEPTEE"] = "ACCEPTEE";
    StatutCommande["REFUSEE"] = "REFUSEE";
    StatutCommande["EN_PREPARATION"] = "EN_PREPARATION";
    StatutCommande["PRETE"] = "PRETE";
    StatutCommande["EN_LIVRAISON"] = "EN_LIVRAISON";
    StatutCommande["LIVREE"] = "LIVREE";
})(StatutCommande || (exports.StatutCommande = StatutCommande = {}));
const TRANSITIONS_AUTORISEES = {
    [StatutCommande.EN_ATTENTE]: [StatutCommande.PAYEE],
    [StatutCommande.PAYEE]: [StatutCommande.ACCEPTEE, StatutCommande.REFUSEE],
    [StatutCommande.ACCEPTEE]: [StatutCommande.EN_PREPARATION],
    [StatutCommande.EN_PREPARATION]: [StatutCommande.PRETE, StatutCommande.EN_LIVRAISON],
    [StatutCommande.PRETE]: [StatutCommande.EN_LIVRAISON],
    [StatutCommande.EN_LIVRAISON]: [StatutCommande.LIVREE],
    [StatutCommande.REFUSEE]: [],
    [StatutCommande.LIVREE]: [],
};
function transitionAutorisee(depuis, vers) {
    return TRANSITIONS_AUTORISEES[depuis].includes(vers);
}