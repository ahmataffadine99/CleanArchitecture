export declare class Avis {
    readonly id: string;
    readonly commandeId: string;
    readonly livreurId: string;
    readonly clientId: string;
    readonly note: number;
    readonly commentaire: string | null;
    readonly creeLe: Date;
    constructor(id: string, commandeId: string, livreurId: string, clientId: string, note: number,
    commentaire?: string | null, creeLe?: Date);
}