export enum StatutCommande {
  EN_ATTENTE = "EN_ATTENTE",
  PAYEE = "PAYEE",
  ACCEPTEE = "ACCEPTEE",
  REFUSEE = "REFUSEE",
  EN_PREPARATION = "EN_PREPARATION",
  PRETE = "PRETE",
  EN_LIVRAISON = "EN_LIVRAISON",
  LIVREE = "LIVREE",
}

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
