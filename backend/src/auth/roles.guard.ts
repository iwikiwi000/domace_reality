import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserDocument } from '../users/users.schema';
import { UserRole } from '../users/user-role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user: UserDocument }>();

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const hasAccess = requiredRoles.includes(user.role);

    if (!hasAccess) {
      throw new ForbiddenException(
        `Access denied: role '${user.role}' not allowed to access this resource`,
      );
    }
    return true;
  }
}
