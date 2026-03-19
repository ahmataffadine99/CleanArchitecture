import { ErreurMetier } from "./ErreurMetier";
import { StatutCommande } from "../value-objects/StatutCommande";
export declare class TransitionStatutInvalideError extends ErreurMetier {
    constructor(depuis: StatutCommande, vers: StatutCommande);
}
//# sourceMappingURL=TransitionStatutInvalideError.d.ts.map