import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMS_KEY } from '../decorators/permissions.decorator';


@Injectable()
export class PermissionsGuard implements CanActivate {
constructor(private reflector: Reflector) {}
canActivate(ctx: ExecutionContext): boolean {
const required = this.reflector.getAllAndOverride<string[]>(PERMS_KEY, [
ctx.getHandler(),
ctx.getClass(),
]) || [];
if (!required.length) return true;
const req = ctx.switchToHttp().getRequest();
const userPerms: string[] = req.user?.perms || [];
return required.every(p => userPerms.includes(p));
}
}