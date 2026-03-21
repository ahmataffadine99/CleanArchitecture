import { Facture } from "@ecoeats/domain";
import { DepotFactures } from "@ecoeats/application";
export declare class DepotFacturesEnMemoire implements DepotFactures {
    private readonly store;
    sauvegarder(facture: Facture): Promise<void>;
    trouverParCommande(commandeId: string): Promise<Facture | null>;
}
//# sourceMappingURL=DepotFacturesEnMemoire.d.ts.map