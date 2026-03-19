import { Livreur } from "@ecoeats/domain";
export interface DepotLivreurs {
    sauvegarder(livreur: Livreur): Promise<void>;
    trouverParId(id: string): Promise<Livreur>;
    listerDisponibles(): Promise<Livreur[]>;
}
//# sourceMappingURL=DepotLivreurs.d.ts.map