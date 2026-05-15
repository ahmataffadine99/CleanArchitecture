import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token JWT manquant ou mal formaté');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'mon_super_secret_jwt_hyper_securise';

    try {
      const decoded = jwt.verify(token, secret);
      request.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token JWT invalide ou expiré');
    }
  }
}
