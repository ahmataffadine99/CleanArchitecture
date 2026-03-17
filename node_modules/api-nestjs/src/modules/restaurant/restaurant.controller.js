"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantController = void 0;
const common_1 = require("@nestjs/common");
const application_1 = require("@ecoeats/application");
const common_2 = require("@nestjs/common");
const auth_guard_1 = require("../../guards/auth.guard");
const roles_guard_1 = require("../../guards/roles.guard");
let RestaurantController = class RestaurantController {
    ajouterPlat;
    modifierPlat;
    supprimerPlat;
    accepterCommande;
    refuserCommande;
    marquerPrete;
    constructor(ajouterPlat, modifierPlat, supprimerPlat, accepterCommande, refuserCommande, marquerPrete) {
        this.ajouterPlat = ajouterPlat;
        this.modifierPlat = modifierPlat;
        this.supprimerPlat = supprimerPlat;
        this.accepterCommande = accepterCommande;
        this.refuserCommande = refuserCommande;
        this.marquerPrete = marquerPrete;
    }
    async ajouterUnPlat(id, body) {
        const plat = await this.ajouterPlat.executer({ restaurantId: id, ...body });
        return { id: plat.id, nom: plat.nom, prix: plat.prix.enEuros() };
    }
    async modifierUnPlat(id, body) {
        await this.modifierPlat.executer({ platId: id, ...body });
    }
    async supprimerUnPlat(id) {
        await this.supprimerPlat.executer(id);
    }
    async accepterLaCommande(id, body) {
        const commande = await this.accepterCommande.executer({
            commandeId: id,
            tempsPreparationMinutes: body.tempsPreparationMinutes,
        });
        return { statut: commande.getStatut(), tempsPreparation: commande.getTempsPreparation() };
    }
    async refuserLaCommande(id) {
        const commande = await this.refuserCommande.executer(id);
        return { statut: commande.getStatut() };
    }
    async marquerLaCommandePrete(id) {
        const commande = await this.marquerPrete.executer(id);
        return { statut: commande.getStatut() };
    }
};
exports.RestaurantController = RestaurantController;
__decorate([
    (0, common_1.Post)(':id/plats'),
    (0, roles_guard_1.Roles)('RESTAURATEUR'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "ajouterUnPlat", null);
__decorate([
    (0, common_1.Patch)('../plats/:id'),
    (0, roles_guard_1.Roles)('RESTAURATEUR'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "modifierUnPlat", null);
__decorate([
    (0, common_1.Delete)('../plats/:id'),
    (0, roles_guard_1.Roles)('RESTAURATEUR'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "supprimerUnPlat", null);
__decorate([
    (0, common_1.Post)('../commandes/:id/accepter'),
    (0, roles_guard_1.Roles)('RESTAURATEUR'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "accepterLaCommande", null);
__decorate([
    (0, common_1.Post)('../commandes/:id/refuser'),
    (0, roles_guard_1.Roles)('RESTAURATEUR'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "refuserLaCommande", null);
__decorate([
    (0, common_1.Post)('../commandes/:id/prete'),
    (0, roles_guard_1.Roles)('RESTAURATEUR'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "marquerLaCommandePrete", null);
exports.RestaurantController = RestaurantController = __decorate([
    (0, common_1.Controller)('restaurant'),
    (0, common_2.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof application_1.AjouterPlatUseCase !== "undefined" && application_1.AjouterPlatUseCase) === "function" ? _a : Object, typeof (_b = typeof application_1.ModifierPlatUseCase !== "undefined" && application_1.ModifierPlatUseCase) === "function" ? _b : Object, typeof (_c = typeof application_1.SupprimerPlatUseCase !== "undefined" && application_1.SupprimerPlatUseCase) === "function" ? _c : Object, typeof (_d = typeof application_1.AccepterCommandeUseCase !== "undefined" && application_1.AccepterCommandeUseCase) === "function" ? _d : Object, typeof (_e = typeof application_1.RefuserCommandeUseCase !== "undefined" && application_1.RefuserCommandeUseCase) === "function" ? _e : Object, typeof (_f = typeof application_1.MarquerCommandePreteUseCase !== "undefined" && application_1.MarquerCommandePreteUseCase) === "function" ? _f : Object])
], RestaurantController);
//# sourceMappingURL=restaurant.controller.js.map