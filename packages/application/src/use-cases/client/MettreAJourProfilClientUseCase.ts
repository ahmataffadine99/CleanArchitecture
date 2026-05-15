import { DepotClients } from "../../ports/DepotClients";
import { DepotComptes } from "../../ports/DepotComptes";
import { ClientIntrouvableError } from "@ecoeats/domain";

export class MettreAJourProfilClientUseCase {
  constructor(
    private readonly depotClients: DepotClients,
    private readonly depotComptes: DepotComptes
  ) {}

  async executer(params: { 
    clientId: string; 
    nom?: string; 
    email?: string; 
    telephone?: string 
  }): Promise<void> {
    const client = await this.depotClients.trouverParId(params.clientId);
    if (!client) throw new ClientIntrouvableError(params.clientId);

    await this.depotClients.mettreAJour(params.clientId, {
      nom: params.nom,
      telephone: params.telephone
    });

    if (params.email) {
      const compte = await this.depotComptes.trouverParId(client.id);
      if (compte) {
        await this.depotComptes.sauvegarder({
          ...compte,
          email: params.email
        });
      }
    }
  }
}
