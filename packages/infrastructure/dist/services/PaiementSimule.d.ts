import { ServicePaiement } from "@ecoeats/application";
export declare class PaiementSimule implements ServicePaiement {
    encaisser(montantCentimes: number, clientId: string): Promise<{
        success: boolean;
        transactionId: string;
    }>;
}