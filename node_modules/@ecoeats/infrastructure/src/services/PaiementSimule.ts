import { ServicePaiement } from "@ecoeats/application";
import { v4 as uuid } from "uuid";

// Simulation d'un paiement — en prod on brancherait Stripe, Adyen, etc.
export class PaiementSimule implements ServicePaiement {
  async encaisser(
    montantCentimes: number,
    clientId: string
  ): Promise<{ success: boolean; transactionId: string }> {
    console.log(`[Paiement] ${montantCentimes / 100}€ prélevé pour le client ${clientId}`);
    // Simule un délai réseau
    await new Promise(res => setTimeout(res, 10));
    return { success: true, transactionId: `TXN-${uuid().slice(0, 8).toUpperCase()}` };
  }
}
