export enum StatutCommande {
  EN_ATTENTE = "EN_ATTENTE",       // commande créée, pas encore payée
  PAYEE = "PAYEE",                  // paiement validé
  ACCEPTEE = "ACCEPTEE",            // restaurateur a accepté
  REFUSEE = "REFUSEE",              // restaurateur a refusé
  EN_PREPARATION = "EN_PREPARATION",
  PRETE = "PRETE",                  // prête pour collecte
  EN_LIVRAISON = "EN_LIVRAISON",
  LIVREE = "LIVREE",
}

// Transitions autorisées dans le workflow d'une commande
const TRANSITIONS_AUTORISEES: Record<StatutCommande, StatutCommande[]> = {
  [StatutCommande.EN_ATTENTE]:     [StatutCommande.PAYEE],
  [StatutCommande.PAYEE]:          [StatutCommande.ACCEPTEE, StatutCommande.REFUSEE],
  [StatutCommande.ACCEPTEE]:       [StatutCommande.EN_PREPARATION],
  [StatutCommande.EN_PREPARATION]: [StatutCommande.PRETE, StatutCommande.EN_LIVRAISON],
  [StatutCommande.PRETE]:          [StatutCommande.EN_LIVRAISON],
  [StatutCommande.EN_LIVRAISON]:   [StatutCommande.LIVREE],
  [StatutCommande.REFUSEE]:        [],
  [StatutCommande.LIVREE]:         [],
};

export function transitionAutorisee(
  depuis: StatutCommande,
  vers: StatutCommande
): boolean {
  return TRANSITIONS_AUTORISEES[depuis].includes(vers);
}
