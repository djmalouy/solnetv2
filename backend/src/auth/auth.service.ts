import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


@Injectable()
export class AuthService {
constructor(private readonly jwt: JwtService) {}


async login(usuario: string, clave: string) {
const user = await prisma.usuario.findUnique({ where: { usuario }, include: { roles: true } });
if (!user) throw new UnauthorizedException('Usuario o clave inválidos');
const ok = await bcrypt.compare(clave, user.clave);
if (!ok) throw new UnauthorizedException('Usuario o clave inválidos');


const payload = { sub: user.id, usuario: user.usuario, nombre: user.nombre, apellido: user.apellido, roles: user.roles.map((r: any) => r.nombre) };
const token = await this.jwt.signAsync(payload);


await prisma.usuario.update({ where: { id: user.id }, data: { ultimoAcceso: new Date() } });


return { token, usuario: { id: user.id, nombre: user.nombre, apellido: user.apellido, roles: payload.roles } };
}
}