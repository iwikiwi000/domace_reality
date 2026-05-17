import { Module, OnModuleInit } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UserRole } from './user-role.enum';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    const userExists = await this.usersService.findByEmail(
      'vwebaAdmin@uniza.sk',
    );
    if (!userExists) {
      await this.usersService.create({
        email: 'vwebaAdmin@uniza.sk',
        password: 'Heslo1234',
        name: 'Admin Adminovic',
        role: UserRole.ADMIN,
      });
      for (let i = 0; i < 10; i++) {
        await this.usersService.create({
          email: `user${i}@uniza.sk`,
          password: 'Heslo1234',
          name: 'user-' + i,
          role: UserRole.USER,
        });
      }
    }
  }
}
