import { PlatMenu } from "@ecoeats/domain";
import { DepotPlats } from "@ecoeats/application";
export declare class DepotPlatsEnMemoire implements DepotPlats {
    private readonly store;
    sauvegarder(plat: PlatMenu): Promise<void>;
    trouverParId(id: string): Promise<PlatMenu>;
    trouverParRestaurant(restaurantId: string): Promise<PlatMenu[]>;
    supprimer(id: string): Promise<void>;
}
//# sourceMappingURL=DepotPlatsEnMemoire.d.ts.map