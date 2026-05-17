import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/users.schema';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwt: JwtService,
  ) {}

  private toPublic(u: UserDocument) {
    return {
      id: u._id.toString(),
      email: u.email,
      name: u.name,
    };
  }

  async register(dto: RegisterDto) {
    const exists = await this.userModel.exists({ email: dto.email });
    if (exists) throw new ConflictException('Email already in use');

    const user = new this.userModel({ email: dto.email, name: dto.name });
    await user.setPassword(dto.password);
    await user.save();

    return this.toPublic(user);
  }

  async login(dto: LoginDto) {
    // nájdi usera aj s hash hesla
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+passwordHash');
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // porovnaj heslo
    const valid = await user.checkPassword(dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    // payload pre JWT
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = await this.jwt.signAsync(payload);

    return { access_token: token };
  }
}
