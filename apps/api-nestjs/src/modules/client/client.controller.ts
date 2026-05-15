import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ListerRestaurantsUseCase,
  VoirMenuRestaurantUseCase,
  AjouterAuPanierUseCase,
  PasserCommandeUseCase,
  PayerCommandeUseCase
} from '@ecoeats/application';

class AjoutArticleDto { clientId: string; platId: string; quantite: number; }
class PasserCommandeDto { clientId: string; adresseLivraison: string; }
class PayerCommandeDto { clientId: string; }

@Controller()
export class ClientController {
  constructor(
    private readonly listerRestaurants: ListerRestaurantsUseCase,
    private readonly voirMenu: VoirMenuRestaurantUseCase,
    private readonly ajouterAuPanier: AjouterAuPanierUseCase,
    private readonly passerCommande: PasserCommandeUseCase,
    private readonly payerCommande: PayerCommandeUseCase,
  ) {}

  @Get('restaurants')
  async getRestaurants() {
    const restaurants = await this.listerRestaurants.executer();
    return restaurants.map(r => ({
      id: r.id, nom: r.nom, adresse: r.adresse,
      position: { lat: r.position.latitude, lon: r.position.longitude },
    }));
  }

  @Get('restaurants/:id/menu')
  async getMenu(@Param('id') id: string) {
    const { disponibles, rupture } = await this.voirMenu.executer(id);
    const formater = (p: any) => ({
      id: p.id, nom: p.nom, description: p.description,
      prix: p.prix.enEuros(), allergenes: p.allergenes, stock: p.stockJournalier,
    });
    return { 
      disponibles: disponibles.map(formater), 
      rupture: rupture.map(formater) 
    };
  }

  @Post('panier/articles')
  @HttpCode(HttpStatus.CREATED)
  async ajouterArticlePanier(@Body() rawDto: AjoutArticleDto) {
    const panier = await this.ajouterAuPanier.executer(rawDto);
    return {
      restaurantId: panier.getRestaurantId(),
      articles: panier.getArticles().map(a => ({
        platId: a.menuItemId, nom: a.nom,
        prix: a.prixSnapshot.enEuros(), quantite: a.quantite,
      })),
      total: panier.prixTotal().enEuros(),
    };
  }

  @Delete('panier/:clientId')
  @HttpCode(HttpStatus.NO_CONTENT)
  viderPanier(@Param('clientId') clientId: string) {
    this.ajouterAuPanier.viderPanier(clientId);
  }

  @Post('commandes')
  @HttpCode(HttpStatus.CREATED)
  async passerLaCommande(@Body() dto: PasserCommandeDto) {
    const panier = this.ajouterAuPanier.getPanier(dto.clientId);
    if (!panier || panier.estVide()) {
      throw new Error("Le panier est vide."); 
    }
    const commande = await this.passerCommande.executer({
      clientId: dto.clientId,
      panier: panier,
      adresseLivraison: dto.adresseLivraison
    });
    
    return {
      id: commande.id, statut: commande.getStatut(),
      total: commande.prixTotal().enEuros(),
      detail: {
        plats: commande.getPrixPlats().enEuros(),
        livraison: commande.getFraisLivraison().enEuros(),
        service: commande.getFraisService().enEuros(),
      },
    };
  }

  @Post('commandes/:id/payer')
  async payerLaCommande(@Param('id') id: string, @Body() dto: PayerCommandeDto) {
    const { facture } = await this.payerCommande.executer({ commandeId: id, clientId: dto.clientId });
    return { factureId: facture.id, total: facture.total.enEuros(), detail: facture.afficher() };
  }
}
