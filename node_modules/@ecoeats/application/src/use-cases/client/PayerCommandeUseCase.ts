import { Commande, StatutCommande, Facture } from "@ecoeats/domain";
import { DepotCommandes } from "../ports/DepotCommandes";
import { DepotFactures } from "../ports/DepotFactures";
import { ServicePaiement } from "../ports/ServicePaiement";
import { v4 as uuid } from "uuid";

type Req = {
  commandeId: string;
  clientId: string;
};

type Resultat = {
  commande: Commande;
  facture: Facture;
};

export class PayerCommandeUseCase {
  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotFactures: DepotFactures,
    private readonly servicePaiement: ServicePaiement
  ) {}

  async executer(req: Req): Promise<Resultat> {
    const commande = await this.depotCommandes.trouverParId(req.commandeId);

    const paiement = await this.servicePaiement.encaisser(
      commande.prixTotal().enCentimes(),
      req.clientId
    );

    if (!paiement.success) {
      throw new Error(`Paiement refusé pour la commande ${req.commandeId}`);
    }

    commande.changerStatut(StatutCommande.PAYEE);

    const facture = new Facture(
      uuid(),
      commande.id,
      req.clientId,
      commande.getArticles(),
      commande.getPrixPlats(),
      commande.getFraisLivraison(),
      commande.getFraisService(),
      commande.prixTotal()
    );

    await this.depotCommandes.sauvegarder(commande);
    await this.depotFactures.sauvegarder(facture);

    return { commande, facture };
  }
}
