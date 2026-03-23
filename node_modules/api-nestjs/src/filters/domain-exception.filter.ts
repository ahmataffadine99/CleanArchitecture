import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ErreurMetier } from '@ecoeats/domain';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  // Mapping entre les codes d'erreur métier internes et les statuts HTTP
  private readonly statusMapping: Record<string, number> = {
    PANIER_CONFLIT_RESTAURANT: HttpStatus.CONFLICT,
    PLAT_EN_RUPTURE: HttpStatus.CONFLICT,
    IDENTIFIANTS_INVALIDES: HttpStatus.UNAUTHORIZED,
    EMAIL_DEJA_UTILISE: HttpStatus.BAD_REQUEST,
    COMMANDE_INTROUVABLE: HttpStatus.NOT_FOUND,
    RESTAURANT_INTROUVABLE: HttpStatus.NOT_FOUND,
    CLIENT_INTROUVABLE: HttpStatus.NOT_FOUND,
    PLAT_INTROUVABLE: HttpStatus.NOT_FOUND,
    AUCUN_LIVREUR_DISPONIBLE: HttpStatus.CONFLICT,
    TRANSITION_STATUT_INVALIDE: HttpStatus.BAD_REQUEST,
  };

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Si c'est une ErreurMetier de notre couche Domain, on la mappe proprement
    if (exception instanceof ErreurMetier) {
      const status = this.statusMapping[exception.code] || HttpStatus.INTERNAL_SERVER_ERROR;
      return response.status(status).json({
        code: exception.code,
        message: exception.message,
      });
    }

    // Gestion standard des erreurs NestJS HTTP
    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json(exception.getResponse());
    }

    // Fallback inattendu
    console.error('[NestJS Error Handler] Compte suspendu. contactez support :', exception);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: 'ERREUR_INTERNE',
      message: "Compte suspendu. contactez support.",
    });
  }
}
