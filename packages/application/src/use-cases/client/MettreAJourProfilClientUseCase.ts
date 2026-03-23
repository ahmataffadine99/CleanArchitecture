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

    // Mettre à jour les infos du client (nom, téléphone)
    await this.depotClients.mettreAJour(params.clientId, {
      nom: params.nom,
      telephone: params.telephone
    });

    // Mettre à jour l'email dans le compte si fourni
    if (params.email) {
      const compte = await this.depotComptes.trouverParId(client.id); // L'ID du client est le même que l'ID du compte
      if (compte) {
        await this.depotComptes.sauvegarder({
          ...compte,
          email: params.email
        });
      }
    }
  }
}
