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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const common_1 = require("@nestjs/common");
const application_1 = require("@ecoeats/application");
class AjoutArticleDto {
    clientId;
    platId;
    quantite;
}
class PasserCommandeDto {
    clientId;
    adresseLivraison;
}
class PayerCommandeDto {
    clientId;
}
let ClientController = class ClientController {
    listerRestaurants;
    voirMenu;
    ajouterAuPanier;
    passerCommande;
    payerCommande;
    constructor(listerRestaurants, voirMenu, ajouterAuPanier, passerCommande, payerCommande) {
        this.listerRestaurants = listerRestaurants;
        this.voirMenu = voirMenu;
        this.ajouterAuPanier = ajouterAuPanier;
        this.passerCommande = passerCommande;
        this.payerCommande = payerCommande;
    }
    async getRestaurants() {
        const restaurants = await this.listerRestaurants.executer();
        return restaurants.map(r => ({
            id: r.id, nom: r.nom, adresse: r.adresse,
            position: { lat: r.position.latitude, lon: r.position.longitude },
        }));
    }
    async getMenu(id) {
        const { disponibles, rupture } = await this.voirMenu.executer(id);
        const formater = (p) => ({
            id: p.id, nom: p.nom, description: p.description,
            prix: p.prix.enEuros(), allergenes: p.allergenes, stock: p.stockJournalier,
        });
        return {
            disponibles: disponibles.map(formater),
            rupture: rupture.map(formater)
        };
    }
    async ajouterArticlePanier(rawDto) {
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
    viderPanier(clientId) {
        this.ajouterAuPanier.viderPanier(clientId);
    }
    async passerLaCommande(dto) {
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
    async payerLaCommande(id, dto) {
        const { facture } = await this.payerCommande.executer({ commandeId: id, clientId: dto.clientId });
        return { factureId: facture.id, total: facture.total.enEuros(), detail: facture.afficher() };
    }
};
exports.ClientController = ClientController;
__decorate([
    (0, common_1.Get)('restaurants'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getRestaurants", null);
__decorate([
    (0, common_1.Get)('restaurants/:id/menu'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getMenu", null);
__decorate([
    (0, common_1.Post)('panier/articles'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AjoutArticleDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "ajouterArticlePanier", null);
__decorate([
    (0, common_1.Delete)('panier/:clientId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "viderPanier", null);
__decorate([
    (0, common_1.Post)('commandes'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PasserCommandeDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "passerLaCommande", null);
__decorate([
    (0, common_1.Post)('commandes/:id/payer'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PayerCommandeDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "payerLaCommande", null);
exports.ClientController = ClientController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof application_1.ListerRestaurantsUseCase !== "undefined" && application_1.ListerRestaurantsUseCase) === "function" ? _a : Object, typeof (_b = typeof application_1.VoirMenuRestaurantUseCase !== "undefined" && application_1.VoirMenuRestaurantUseCase) === "function" ? _b : Object, typeof (_c = typeof application_1.AjouterAuPanierUseCase !== "undefined" && application_1.AjouterAuPanierUseCase) === "function" ? _c : Object, typeof (_d = typeof application_1.PasserCommandeUseCase !== "undefined" && application_1.PasserCommandeUseCase) === "function" ? _d : Object, typeof (_e = typeof application_1.PayerCommandeUseCase !== "undefined" && application_1.PayerCommandeUseCase) === "function" ? _e : Object])
], ClientController);
//# sourceMappingURL=client.controller.js.map