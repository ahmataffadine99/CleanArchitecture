import { Commande, Facture } from "@ecoeats/domain";
import { DepotCommandes } from "../ports/DepotCommandes";
import { DepotFactures } from "../ports/DepotFactures";
import { ServicePaiement } from "../ports/ServicePaiement";
type Req = {
    commandeId: string;
    clientId: string;
};
type Resultat = {
    commande: Commande;
    facture: Facture;
};
export declare class PayerCommandeUseCase {
    private readonly depotCommandes;
    private readonly depotFactures;
    private readonly servicePaiement;
    constructor(depotCommandes: DepotCommandes, depotFactures: DepotFactures, servicePaiement: ServicePaiement);
    executer(req: Req): Promise<Resultat>;
}
export {};
//# sourceMappingURL=PayerCommandeUseCase.d.ts.map