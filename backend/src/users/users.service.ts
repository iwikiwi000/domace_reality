// users.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { UserRole } from './user-role.enum';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // async create(data: {
  //   email: string;
  //   name: string;
  //   password: string;
  //   role: UserRole;
  // }) {
  //   const salt = crypto.randomBytes(16).toString('hex');
  //   const passwordHash = crypto
  //     .pbkdf2Sync(data.password, salt, 1000, 64, 'sha512')
  //     .toString('hex');

  //   const user = new this.userModel({
  //     email: data.email,
  //     name: data.name,
  //     salt,
  //     passwordHash,
  //     role: data.role || UserRole.USER,
  //     favorites: [],
  //   });

  //   await user.save();
  //   const { passwordHash: _, salt: __, ...safeUser } = user.toObject();
  //   return safeUser;
  // }

  async findAll() {
    const users = await this.userModel.find().select('-salt -passwordHash');
    return users;
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = await this.userModel
      .findById(id)
      .select('-salt -passwordHash');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async update(
    id: string,
    updateData: { name?: string; email?: string; role?: string },
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .select('-salt -passwordHash');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(data: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
  }) {
    const user = new this.userModel({
      email: data.email,
      name: data.name,
      role: data.role || UserRole.USER,
      favorites: [],
    });

    // Použite metódu zo schémy
    await user.setPassword(data.password);
    await user.save();

    const { passwordHash: _, salt: __, ...safeUser } = user.toObject();
    return safeUser;
  }

  async updatePassword(
    id: string,
    passwordDto: { currentPassword: string; newPassword: string },
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Overenie aktuálneho hesla pomocou metódy zo schémy
    const isPasswordValid = await user.checkPassword(
      passwordDto.currentPassword,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Nastavenie nového hesla pomocou metódy zo schémy
    await user.setPassword(passwordDto.newPassword);
    await user.save();

    return { message: 'Password updated successfully' };
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Voliteľné: zmazať všetky nehnuteľnosti používateľa
    // await this.realityModel.deleteMany({ author: new Types.ObjectId(id) });

    return { message: 'User deleted successfully' };
  }

  async toggleFav(userId: string, realityId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const index = user.favorites.indexOf(realityId);
    if (index === -1) {
      user.favorites.push(realityId);
    } else {
      user.favorites.splice(index, 1);
    }
    await user.save();

    return { favorites: user.favorites };
  }

  private hashPassword(password: string, salt: string): string {
    return crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
  }
}
