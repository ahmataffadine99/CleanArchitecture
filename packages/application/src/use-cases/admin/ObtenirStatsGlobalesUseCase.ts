import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotComptes } from "../../ports/DepotComptes";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
import { DepotTickets } from "../../ports/DepotTickets";
import { ServiceCartographie } from "../../ports/ServiceCartographie";

export class ObtenirStatsGlobalesUseCase {
  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotComptes: DepotComptes,
    private readonly depotRestaurants: DepotRestaurants,
    private readonly depotTickets: DepotTickets,
    private readonly cartographie: ServiceCartographie
  ) {}

  async executer() {
    const [commandes, comptes, restaurants, tickets] = await Promise.all([
      this.depotCommandes.trouverTout(),
      this.depotComptes.trouverTout(),
      this.depotRestaurants.listerTous(),
      this.depotTickets.listerTickets()
    ]);

    const livrees = commandes.filter((c: any) => c.getStatut() === "LIVREE");

    const revenuTotalCentimes = livrees
      .reduce((acc: number, c: any) => acc + c.prixTotal().enCentimes(), 0);

    // Calcul de l'impact écologique (CO2 économisé en Kg)
    const totalCO2Grammes = livrees.reduce((acc: number, c: any) => {
      const resto = restaurants.find(r => r.id === c.restaurantId);
      if (!resto) return acc;
      
      const distance = this.cartographie.calculerDistanceKm(
        resto.position,
        c.getPositionLivraison()
      );
      
      return acc + c.calculerCO2Economise(distance);
    }, 0);

    const maintenant = new Date();
    const hier = new Date(maintenant);
    hier.setDate(hier.getDate() - 1);

    const commandesAujourdhui = commandes.filter((c: any) => c.getCreeLe() >= hier).length;
    const commandesHier = commandes.filter((c: any) => c.getCreeLe() < hier && c.getCreeLe() >= new Date(hier.getTime() - 24*3600*1000)).length;
    
    let tendanceCommandes = 0;
    if (commandesHier > 0) {
      tendanceCommandes = Math.round(((commandesAujourdhui - commandesHier) / commandesHier) * 100);
    } else if (commandesAujourdhui > 0) {
      tendanceCommandes = 100;
    }

    const nouveauxComptesHier = comptes.filter((c: any) => {
      return c.creeLe && c.creeLe >= hier;
    }).length;

    const commandesEnAttente = commandes.filter((c: any) => c.getStatut() === "EN_ATTENTE").length;
    const ticketsOuverts = tickets.filter((t: any) => t.statut === "OUVERT" && !t.estLu).length;

    return {
      nbUtilisateurs: comptes.length,
      nbCommandes: commandes.length,
      nbRestaurants: restaurants.length,
      revenuTotalEuros: revenuTotalCentimes / 100,
      co2TotalKg: Math.round(totalCO2Grammes / 100) / 10, // En Kg avec 1 décimale
      tendances: {
        commandes: tendanceCommandes,
        nouveauxComptes: nouveauxComptesHier,
        restaurantsSemaine: restaurants.length, // Simplifié
        enAttente: commandesEnAttente,
        ticketsOuverts: ticketsOuverts
      },
      commandesRecentes: commandes
        .sort((a: any, b: any) => b.getCreeLe().getTime() - a.getCreeLe().getTime())
        .slice(0, 5)
        .map((c: any) => ({
          id: c.id,
          statut: c.getStatut(),
          prixTotal: c.prixTotal().enEuros(),
          creeLe: c.getCreeLe()
        }))
    };
  }
}
