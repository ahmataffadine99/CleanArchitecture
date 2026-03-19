import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { InscriptionUseCase, ConnexionUseCase } from '@ecoeats/application';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly inscription: InscriptionUseCase,
    private readonly connexion: ConnexionUseCase,
  ) {}

  @Post('register')
  async register(@Body() body: any) {
    const { nom, email, motDePasse, role, adresse, telephone } = body;
    const { compte } = await this.inscription.executer({ nom, email, motDePasse, role, adresse, telephone });
    
    return {
      id: compte.id,
      email: compte.email,
      role: compte.role,
      profilId: compte.profilId,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    const { email, motDePasse } = body;
    const resultat = await this.connexion.executer({ email, motDePasse });
    return resultat;
  }
}
