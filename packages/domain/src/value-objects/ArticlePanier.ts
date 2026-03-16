import { Money } from "./Money";

// Représente un article dans le panier — snapshot du prix au moment de l'ajout
export class ArticlePanier {
  constructor(
    readonly menuItemId: string,
    readonly nom: string,
    readonly prixSnapshot: Money,
    readonly quantite: number,
    readonly restaurantId: string
  ) {
    if (quantite <= 0) {
      throw new Error("La quantité doit être supérieure à 0");
    }
  }

  prixTotal(): Money {
    return this.prixSnapshot.multiplier(this.quantite);
  }

  avecQuantite(nouvelleQuantite: number): ArticlePanier {
    return new ArticlePanier(
      this.menuItemId,
      this.nom,
      this.prixSnapshot,
      nouvelleQuantite,
      this.restaurantId
    );
  }
}
