// Abstraction pour le paiement — permet de swapper l'implémentation
export interface ServicePaiement {
  encaisser(montantCentimes: number, clientId: string): Promise<{ success: boolean; transactionId: string }>;
}
