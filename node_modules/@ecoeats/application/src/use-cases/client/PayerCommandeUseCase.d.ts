import { Commande, Facture } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotFactures } from "../../ports/DepotFactures";
import { DepotClients } from "../../ports/DepotClients";
import { ServicePaiement } from "../../ports/ServicePaiement";
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
    private readonly depotClients?;
    constructor(depotCommandes: DepotCommandes, depotFactures: DepotFactures, servicePaiement: ServicePaiement, depotClients?: DepotClients | undefined);
    executer(req: Req): Promise<Resultat>;
}
export {};
//# sourceMappingURL=PayerCommandeUseCase.d.ts.map