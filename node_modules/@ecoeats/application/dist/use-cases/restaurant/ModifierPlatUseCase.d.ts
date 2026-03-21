import { DepotPlats } from "../../ports/DepotPlats";
type Req = {
    platId: string;
    nom?: string;
    description?: string;
    prixEuros?: number;
    allergenes?: string[];
    stockJournalier?: number;
    imageUrl?: string | null;
    actif?: boolean;
    categorie?: string;
};
export declare class ModifierPlatUseCase {
    private readonly depotPlats;
    constructor(depotPlats: DepotPlats);
    executer(req: Req): Promise<void>;
}
export {};
//# sourceMappingURL=ModifierPlatUseCase.d.ts.map