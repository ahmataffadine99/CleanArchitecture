export interface ServicePaiement {
    encaisser(montantCentimes: number, clientId: string): Promise<{
        success: boolean;
        transactionId: string;
    }>;
}