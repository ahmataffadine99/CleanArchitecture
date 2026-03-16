import { Panier, ArticlePanier, Money } from "@ecoeats/domain";
import { PlatIntrouvableError, PlatEnRuptureError } from "@ecoeats/domain";
import { DepotPlats } from "../ports/DepotPlats";
import { DepotClients } from "../ports/DepotClients";

type Commande = {
  clientId: string;
  platId: string;
  quantite: number;
};

// Retourne le panier mis à jour ou l'erreur si conflit de restaurant
export class AjouterAuPanierUseCase {
  private readonly paniers = new Map<string, Panier>();

  constructor(
    private readonly depotPlats: DepotPlats,
    private readonly depotClients: DepotClients
  ) {}

  async executer(req: Commande): Promise<Panier> {
    await this.depotClients.trouverParId(req.clientId); // vérifie que le client existe

    const plat = await this.depotPlats.trouverParId(req.platId);

    if (!plat.estDisponible()) {
      throw new PlatEnRuptureError(plat.id);
    }

    const panier = this.obtenirOuCreerPanier(req.clientId);

    const article = new ArticlePanier(
      plat.id,
      plat.nom,
      plat.prix,
      req.quantite,
      plat.restaurantId
    );

    panier.ajouterArticle(article); // lève PanierConflitRestaurantError si conflit
    return panier;
  }

  viderPanier(clientId: string): void {
    const panier = this.paniers.get(clientId);
    if (panier) panier.vider();
  }

  getPanier(clientId: string): Panier | null {
    return this.paniers.get(clientId) ?? null;
  }

  private obtenirOuCreerPanier(clientId: string): Panier {
    if (!this.paniers.has(clientId)) {
      this.paniers.set(clientId, new Panier(clientId));
    }
    return this.paniers.get(clientId)!;
  }
}
