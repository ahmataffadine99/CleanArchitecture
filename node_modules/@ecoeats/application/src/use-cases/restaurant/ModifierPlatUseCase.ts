import { Money } from "@ecoeats/domain";
import { DepotPlats } from "../../ports/DepotPlats";

type Req = {
  platId: string;
  nom?: string;
  description?: string;
  prixEuros?: number;
  allergenes?: string[];
  stockJournalier?: number;
  imageUrl?: string | null;
  actif?: boolean;
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
      imageUrl: req.imageUrl,
      actif: req.actif,
    });

    await this.depotPlats.sauvegarder(plat);
  }
}
