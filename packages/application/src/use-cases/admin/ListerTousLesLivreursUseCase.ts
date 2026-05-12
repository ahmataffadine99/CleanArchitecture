import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { Livreur } from "@ecoeats/domain";

export class ListerTousLesLivreursUseCase {
  constructor(private readonly depotLivreurs: DepotLivreurs) {}

  async executer(): Promise<any[]> {
    const livreurs = await this.depotLivreurs.listerTout();
    return livreurs.map(l => ({
      id: l.id,
      nom: l.nom,
      statut: l.getStatut(),
      portefeuille: l.getPortefeuille().enEuros(),
      estExpert: l.estExpert,
      coursesCount: l.getCommandesEnCoursIds().length + (l.getPropositionsIds().length > 0 ? 1 : 0), // Simulation
      impactEco: 95 // Valeur par défaut pour l'affichage
    }));
  }
}
