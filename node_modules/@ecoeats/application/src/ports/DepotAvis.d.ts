import { Avis } from "@ecoeats/domain";
export interface DepotAvis {
    sauvegarder(avis: Avis): Promise<void>;
    trouverParLivreur(livreurId: string): Promise<Avis[]>;
    trouverParCommande(commandeId: string): Promise<Avis | null>;
}
//# sourceMappingURL=DepotAvis.d.ts.map