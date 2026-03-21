import { DepotCommandes } from "../../ports/DepotCommandes";
import { CommandeIntrouvableError } from "@ecoeats/domain";

export class ObtenirCommandeUseCase {
  constructor(private readonly depotCommandes: DepotCommandes) {}

  async executer(commandeId: string): Promise<any> {
    const commande = await this.depotCommandes.trouverParId(commandeId);
    if (!commande) throw new CommandeIntrouvableError(commandeId);

    return {
      id: commande.id,
      restaurantId: commande.restaurantId,
      clientId: commande.clientId,
      statut: commande.getStatut(),
      prixTotal: commande.prixTotal().enEuros(),
      creeLe: commande.getCreeLe(),
      articles: commande.getArticles().map(a => ({
        nom: a.nom,
        quantite: a.quantite,
        prix: a.prixSnapshot.enEuros()
      })),
      adresseLivraison: commande.getAdresseLivraison()
    };
  }
}
