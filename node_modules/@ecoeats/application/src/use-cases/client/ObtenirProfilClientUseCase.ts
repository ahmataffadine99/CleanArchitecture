import { DepotClients } from "../../ports/DepotClients";
import { ClientIntrouvableError } from "@ecoeats/domain";

export class ObtenirProfilClientUseCase {
  constructor(private readonly depotClients: DepotClients) {}

  async executer(clientId: string) {
    const client = await this.depotClients.trouverParId(clientId);
    if (!client) throw new ClientIntrouvableError(clientId);

    return {
      id: client.id,
      nom: client.nom,
      email: client.email,
      telephone: client.telephone,
      pointsFidelite: client.getPointsFidelite()
    };
  }
}
