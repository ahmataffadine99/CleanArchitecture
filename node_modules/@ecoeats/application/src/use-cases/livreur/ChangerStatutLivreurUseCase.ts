import { Livreur } from "@ecoeats/domain";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { DepotCommandes } from "../../ports/DepotCommandes";

type Req = {
  livreurId: string;
  statut: "DISPONIBLE" | "INDISPONIBLE";
};

import { DepotRestaurants } from "../../ports/DepotRestaurants";
import { ServiceCartographie } from "../../ports/ServiceCartographie";

export class ChangerStatutLivreurUseCase {
  private readonly RAYON_ACTION_KM = 5.0;

  constructor(
    private readonly depotLivreurs: DepotLivreurs,
    private readonly depotCommandes: DepotCommandes,
    private readonly depotRestaurants: DepotRestaurants,
    private readonly cartographie: ServiceCartographie
  ) {}

  async executer(req: Req): Promise<Livreur> {
    const livreur = await this.depotLivreurs.trouverParId(req.livreurId);

    if (req.statut === "DISPONIBLE") {
      livreur.seDeclarerDisponible();
      
      // Assigner les propositions en attente (seulement celles à proximité)
      const commandesSansLivreur = await this.depotCommandes.trouverCommandesSansLivreur();
      for (const cmd of commandesSansLivreur) {
        const restaurant = await this.depotRestaurants.trouverParId(cmd.restaurantId);
        const distance = this.cartographie.calculerDistanceKm(restaurant.position, livreur.position);
        
        if (distance <= this.RAYON_ACTION_KM) {
          livreur.recevoirProposition(cmd.id);
        }
      }
    } else {
      livreur.seDeclarerIndisponible();
    }

    await this.depotLivreurs.sauvegarder(livreur);
    return livreur;
  }
}
