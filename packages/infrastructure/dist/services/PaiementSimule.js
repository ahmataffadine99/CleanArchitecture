"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaiementSimule = void 0;
const uuid_1 = require("uuid");
class PaiementSimule {
    async encaisser(montantCentimes, clientId) {
        console.log(`[Paiement] ${montantCentimes / 100}€ prélevé pour le client ${clientId}`);
        await new Promise(res => setTimeout(res, 10));
        return { success: true, transactionId: `TXN-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}` };
    }
}
exports.PaiementSimule = PaiementSimule;