import { InscriptionUseCase, ConnexionUseCase } from '@ecoeats/application';
export declare class AuthController {
    private readonly inscription;
    private readonly connexion;
    constructor(inscription: InscriptionUseCase, connexion: ConnexionUseCase);
    register(body: any): Promise<{
        id: any;
        email: any;
        role: any;
        profilId: any;
    }>;
    login(body: any): Promise<any>;
}
//# sourceMappingURL=auth.controller.d.ts.map