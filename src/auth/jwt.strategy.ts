
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService, JwtPayload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    });
  }

  //não entendi se a API do nestjs ia colaborar no uso do ResultMonad, então decidi so voltar pra exception aqui
  async validate(payload: JwtPayload) {    
    const user = await this.authService.validateUserByPayload(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
