export interface ServicePaiement {
    encaisser(montantCentimes: number, clientId: string): Promise<{
        success: boolean;
        transactionId: string;
    }>;
}
//# sourceMappingURL=ServicePaiement.d.ts.map