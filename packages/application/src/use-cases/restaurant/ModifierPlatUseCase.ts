import { Money } from "@ecoeats/domain";
import { DepotPlats } from "../ports/DepotPlats";

type Req = {
  platId: string;
  nom?: string;
  description?: string;
  prixEuros?: number;
  allergenes?: string[];
  stockJournalier?: number;
};

export class ModifierPlatUseCase {
  constructor(private readonly depotPlats: DepotPlats) {}

  async executer(req: Req): Promise<void> {
    const plat = await this.depotPlats.trouverParId(req.platId);

    plat.mettreAJour({
      nom: req.nom,
      description: req.description,
      prix: req.prixEuros !== undefined ? Money.fromEuros(req.prixEuros) : undefined,
      allergenes: req.allergenes,
      stockJournalier: req.stockJournalier,
    });

    await this.depotPlats.sauvegarder(plat);
  }
}
