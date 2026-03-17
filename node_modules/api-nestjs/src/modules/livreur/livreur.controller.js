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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivreurController = void 0;
const common_1 = require("@nestjs/common");
const application_1 = require("@ecoeats/application");
const common_2 = require("@nestjs/common");
const auth_guard_1 = require("../../guards/auth.guard");
const roles_guard_1 = require("../../guards/roles.guard");
let LivreurController = class LivreurController {
    changerStatut;
    attribuerLivraison;
    terminerLivraison;
    constructor(changerStatut, attribuerLivraison, terminerLivraison) {
        this.changerStatut = changerStatut;
        this.attribuerLivraison = attribuerLivraison;
        this.terminerLivraison = terminerLivraison;
    }
    async updateStatut(id, body) {
        await this.changerStatut.executer({ livreurId: id, nouveauStatut: body.statut });
        return { statut: body.statut };
    }
    async attribuerLeLivreur(id) {
        const resultat = await this.attribuerLivraison.executer(id);
        return {
            commandeId: resultat.commandeId,
            livreurId: resultat.livreurId,
            livreurNom: resultat.livreurNom,
            distanceKm: resultat.distanceKm,
        };
    }
    async marquerCommandeLivree(id) {
        const resultat = await this.terminerLivraison.executer(id);
        return {
            commandeId: resultat.commande.id,
            statut: resultat.commande.getStatut(),
            livreurPortefeuille: resultat.livreurRenumere.enEuros(),
        };
    }
};
exports.LivreurController = LivreurController;
__decorate([
    (0, common_1.Patch)('livreurs/:id/statut'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LivreurController.prototype, "updateStatut", null);
__decorate([
    (0, common_1.Post)('commandes/:id/attribuer-livreur'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LivreurController.prototype, "attribuerLeLivreur", null);
__decorate([
    (0, common_1.Post)('commandes/:id/livree'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LivreurController.prototype, "marquerCommandeLivree", null);
exports.LivreurController = LivreurController = __decorate([
    (0, common_1.Controller)(),
    (0, common_2.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('LIVREUR'),
    __metadata("design:paramtypes", [typeof (_a = typeof application_1.ChangerStatutLivreurUseCase !== "undefined" && application_1.ChangerStatutLivreurUseCase) === "function" ? _a : Object, typeof (_b = typeof application_1.AttribuerLivraisonUseCase !== "undefined" && application_1.AttribuerLivraisonUseCase) === "function" ? _b : Object, typeof (_c = typeof application_1.TerminerLivraisonUseCase !== "undefined" && application_1.TerminerLivraisonUseCase) === "function" ? _c : Object])
], LivreurController);
//# sourceMappingURL=livreur.controller.js.map