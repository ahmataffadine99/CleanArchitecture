import { Controller, Post, Patch, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ChangerStatutLivreurUseCase,
  AttribuerLivraisonUseCase,
  TerminerLivraisonUseCase,
} from '@ecoeats/application';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard, Roles } from '../../guards/roles.guard';

@Controller()
@UseGuards(AuthGuard, RolesGuard)
@Roles('LIVREUR')
export class LivreurController {
  constructor(
    private readonly changerStatut: ChangerStatutLivreurUseCase,
    private readonly attribuerLivraison: AttribuerLivraisonUseCase,
    private readonly terminerLivraison: TerminerLivraisonUseCase,
  ) {}

  @Patch('livreurs/:id/statut')
  @HttpCode(HttpStatus.OK)
  async updateStatut(@Param('id') id: string, @Body() body: { statut: string }) {
    await this.changerStatut.executer({ livreurId: id, nouveauStatut: body.statut });
    return { statut: body.statut };
  }

  @Post('commandes/:id/attribuer-livreur')
  @HttpCode(HttpStatus.OK)
  async attribuerLeLivreur(@Param('id') id: string) {
    const resultat = await this.attribuerLivraison.executer(id);
    return {
      commandeId: resultat.commandeId,
      livreurId: resultat.livreurId,
      livreurNom: resultat.livreurNom,
      distanceKm: resultat.distanceKm,
    };
  }

  @Post('commandes/:id/livree')
  @HttpCode(HttpStatus.OK)
  async marquerCommandeLivree(@Param('id') id: string) {
    const resultat = await this.terminerLivraison.executer(id);
    return {
      commandeId: resultat.commande.id,
      statut: resultat.commande.getStatut(),
      livreurPortefeuille: resultat.livreurRenumere.enEuros(),
    };
  }
}
