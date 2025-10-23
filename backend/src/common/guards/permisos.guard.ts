import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISOS_KEY } from '../decorators/permisos.decorator';


@Injectable()
export class PermisosGuard implements CanActivate {
constructor(private reflector: Reflector) {}
canActivate(ctx: ExecutionContext): boolean {
const req = ctx.switchToHttp().getRequest();
const requeridos = this.reflector.getAllAndOverride<string[]>(PERMISOS_KEY, [ctx.getHandler(), ctx.getClass()]) || [];
if (!requeridos.length) return true;
const usuario = req.user; // inyectado por JwtStrategy
const roles: string[] = usuario?.roles || [];
// Simplificación: si es ADMIN, puede todo
if (roles.includes('ADMIN')) return true;
// Aquí podrías mapear permisos reales por rol desde BD si lo necesitás
return false; // por ahora, solo ADMIN pasa
}
}