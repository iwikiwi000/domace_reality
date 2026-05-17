import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from 'src/users/user-role.enum';

export type JwtUser = {
  userId: string;
  email: string;
  role: UserRole;
};

interface RequestWithUser extends Request {
  user: JwtUser;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    return req.user;
  },
);
