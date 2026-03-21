import { PlatMenu } from "@ecoeats/domain";
export interface DepotPlats {
    sauvegarder(plat: PlatMenu): Promise<void>;
    trouverParId(id: string): Promise<PlatMenu>;
    trouverParRestaurant(restaurantId: string): Promise<PlatMenu[]>;
    supprimer(id: string): Promise<void>;
}
//# sourceMappingURL=DepotPlats.d.ts.map