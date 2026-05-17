import { Body, Controller, Post } from '@nestjs/common';
import { ZodPipe } from 'src/core/zod.pipe';
import type { LoginDto, RegisterDto } from './auth.dto';
import { LoginSchema, RegisterSchema } from './auth.dto';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
//regergerg
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  //register(@Body() body: { email: string; name: string; password: string }) {
  register(@Body(new ZodPipe(RegisterSchema)) body: RegisterDto) {
    return this.auth.register(body);
  }

  @Post('login')
  async login(@Body(new ZodPipe(LoginSchema)) body: LoginDto) {
    return this.auth.login(body);
  }
}
