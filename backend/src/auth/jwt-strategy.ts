import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from 'src/users/user-role.enum';

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // nebudeme to riešiť
      //secretOrKey: secret,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key',
    });
  }

  validate(payload: {
    userId: string;
    email: string;
    role?: UserRole;
    favorites: string[];
  }) {
    // hodnota sa uloží do req.user
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      favorites: payload.favorites,
    };
  }
}
