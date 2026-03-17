import { Controller, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  AjouterPlatUseCase,
  ModifierPlatUseCase,
  SupprimerPlatUseCase,
  AccepterCommandeUseCase,
  RefuserCommandeUseCase,
  MarquerCommandePreteUseCase,
} from '@ecoeats/application';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard, Roles } from '../../guards/roles.guard';

@Controller('restaurant')
@UseGuards(AuthGuard, RolesGuard) // Applique l'authentification et la vérification des rôles
export class RestaurantController {
  constructor(
    private readonly ajouterPlat: AjouterPlatUseCase,
    private readonly modifierPlat: ModifierPlatUseCase,
    private readonly supprimerPlat: SupprimerPlatUseCase,
    private readonly accepterCommande: AccepterCommandeUseCase,
    private readonly refuserCommande: RefuserCommandeUseCase,
    private readonly marquerPrete: MarquerCommandePreteUseCase,
  ) {}

  @Post(':id/plats')
  @Roles('RESTAURATEUR')
  @HttpCode(HttpStatus.CREATED)
  async ajouterUnPlat(@Param('id') id: string, @Body() body: any) {
    const plat = await this.ajouterPlat.executer({ restaurantId: id, ...body });
    return { id: plat.id, nom: plat.nom, prix: plat.prix.enEuros() };
  }

  @Patch('../plats/:id')
  @Roles('RESTAURATEUR')
  @HttpCode(HttpStatus.NO_CONTENT)
  async modifierUnPlat(@Param('id') id: string, @Body() body: any) {
    await this.modifierPlat.executer({ platId: id, ...body });
  }

  @Delete('../plats/:id')
  @Roles('RESTAURATEUR')
  @HttpCode(HttpStatus.NO_CONTENT)
  async supprimerUnPlat(@Param('id') id: string) {
    await this.supprimerPlat.executer(id);
  }

  @Post('../commandes/:id/accepter')
  @Roles('RESTAURATEUR')
  async accepterLaCommande(@Param('id') id: string, @Body() body: { tempsPreparationMinutes: number }) {
    const commande = await this.accepterCommande.executer({
      commandeId: id,
      tempsPreparationMinutes: body.tempsPreparationMinutes,
    });
    return { statut: commande.getStatut(), tempsPreparation: commande.getTempsPreparation() };
  }

  @Post('../commandes/:id/refuser')
  @Roles('RESTAURATEUR')
  async refuserLaCommande(@Param('id') id: string) {
    const commande = await this.refuserCommande.executer(id);
    return { statut: commande.getStatut() };
  }

  @Post('../commandes/:id/prete')
  @Roles('RESTAURATEUR')
  async marquerLaCommandePrete(@Param('id') id: string) {
    const commande = await this.marquerPrete.executer(id);
    return { statut: commande.getStatut() };
  }
}
