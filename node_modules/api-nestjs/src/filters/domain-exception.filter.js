"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const domain_1 = require("@ecoeats/domain");
let DomainExceptionFilter = class DomainExceptionFilter {
    statusMapping = {
        PANIER_CONFLIT_RESTAURANT: common_1.HttpStatus.CONFLICT,
        PLAT_EN_RUPTURE: common_1.HttpStatus.CONFLICT,
        IDENTIFIANTS_INVALIDES: common_1.HttpStatus.UNAUTHORIZED,
        EMAIL_DEJA_UTILISE: common_1.HttpStatus.BAD_REQUEST,
        COMMANDE_INTROUVABLE: common_1.HttpStatus.NOT_FOUND,
        RESTAURANT_INTROUVABLE: common_1.HttpStatus.NOT_FOUND,
        CLIENT_INTROUVABLE: common_1.HttpStatus.NOT_FOUND,
        PLAT_INTROUVABLE: common_1.HttpStatus.NOT_FOUND,
        AUCUN_LIVREUR_DISPONIBLE: common_1.HttpStatus.CONFLICT,
        TRANSITION_STATUT_INVALIDE: common_1.HttpStatus.BAD_REQUEST,
    };
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof domain_1.ErreurMetier) {
            const status = this.statusMapping[exception.code] || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            return response.status(status).json({
                code: exception.code,
                message: exception.message,
            });
        }
        if (exception instanceof common_1.HttpException) {
            return response.status(exception.getStatus()).json(exception.getResponse());
        }
        console.error('[NestJS Error Handler] Une erreur inattendue est survenue :', exception);
        return response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: 'ERREUR_INTERNE',
            message: "Une erreur inattendue s'est produite.",
        });
    }
};
exports.DomainExceptionFilter = DomainExceptionFilter;
exports.DomainExceptionFilter = DomainExceptionFilter = __decorate([
    (0, common_1.Catch)()
], DomainExceptionFilter);
//# sourceMappingURL=domain-exception.filter.js.map