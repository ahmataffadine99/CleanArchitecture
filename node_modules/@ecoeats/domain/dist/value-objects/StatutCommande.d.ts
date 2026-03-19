export declare enum StatutCommande {
    EN_ATTENTE = "EN_ATTENTE",// commande créée, pas encore payée
    PAYEE = "PAYEE",// paiement validé
    ACCEPTEE = "ACCEPTEE",// restaurateur a accepté
    REFUSEE = "REFUSEE",// restaurateur a refusé
    EN_PREPARATION = "EN_PREPARATION",
    PRETE = "PRETE",// prête pour collecte
    EN_LIVRAISON = "EN_LIVRAISON",
    LIVREE = "LIVREE"
}
export declare function transitionAutorisee(depuis: StatutCommande, vers: StatutCommande): boolean;
//# sourceMappingURL=StatutCommande.d.ts.map