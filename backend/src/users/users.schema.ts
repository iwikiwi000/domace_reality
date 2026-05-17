import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { pbkdf2, randomBytes } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { promisify } from 'util';
import { UserRole } from './user-role.enum';

const pbkdf2Async = promisify(pbkdf2);

export type UserDocument = HydratedDocument<User> & {
  setPassword(password: string): Promise<void>;
  checkPassword(password: string): Promise<boolean>;
  favorites: string[];
};

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  salt: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  })
  role: UserRole;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ default: [] })
  favorites: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.setPassword = async function (
  this: UserDocument,
  password: string,
): Promise<void> {
  this.salt = randomBytes(32).toString('hex');
  this.passwordHash = (
    await pbkdf2Async(password, this.salt, 100000, 64, 'sha256')
  ).toString('hex');
};

UserSchema.methods.checkPassword = async function (
  this: UserDocument,
  password: string,
): Promise<boolean> {
  const hash = (
    await pbkdf2Async(password, this.salt, 100000, 64, 'sha256')
  ).toString('hex');
  return this.passwordHash === hash;
};
