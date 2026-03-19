import { Facture } from "@ecoeats/domain";
export interface DepotFactures {
    sauvegarder(facture: Facture): Promise<void>;
    trouverParCommande(commandeId: string): Promise<Facture | null>;
}
//# sourceMappingURL=DepotFactures.d.ts.map