import { Commande } from "@ecoeats/domain";
import { CommandeIntrouvableError } from "@ecoeats/domain";

export interface DepotCommandes {
  sauvegarder(commande: Commande): Promise<void>;
  trouverParId(id: string): Promise<Commande>;
  trouverParRestaurant(restaurantId: string): Promise<Commande[]>;
  trouverParClient(clientId: string): Promise<Commande[]>;
  trouverParLivreur(livreurId: string): Promise<Commande[]>;
  trouverTout(): Promise<Commande[]>;
  trouverCommandesSansLivreur(): Promise<Commande[]>;
}
