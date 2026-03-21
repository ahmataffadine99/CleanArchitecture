"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaiementSimule = void 0;
const uuid_1 = require("uuid");
// Simulation d'un paiement — en prod on brancherait Stripe, Adyen, etc.
class PaiementSimule {
    async encaisser(montantCentimes, clientId) {
        console.log(`[Paiement] ${montantCentimes / 100}€ prélevé pour le client ${clientId}`);
        // Simule un délai réseau
        await new Promise(res => setTimeout(res, 10));
        return { success: true, transactionId: `TXN-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}` };
    }
}
exports.PaiementSimule = PaiementSimule;
//# sourceMappingURL=PaiementSimule.js.map