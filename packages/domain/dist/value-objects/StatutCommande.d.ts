export declare enum StatutCommande {
    EN_ATTENTE = "EN_ATTENTE",
    PAYEE = "PAYEE",
    ACCEPTEE = "ACCEPTEE",
    REFUSEE = "REFUSEE",
    EN_PREPARATION = "EN_PREPARATION",
    PRETE = "PRETE",
    EN_LIVRAISON = "EN_LIVRAISON",
    LIVREE = "LIVREE"
}
export declare function transitionAutorisee(depuis: StatutCommande, vers: StatutCommande): boolean;