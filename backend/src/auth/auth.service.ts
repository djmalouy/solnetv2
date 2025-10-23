import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  // 🔐 LOGIN
  async login(usuario: string, clave: string) {
    // Buscar usuario + roles con join a Rol
    const user = await prisma.usuario.findUnique({
      where: { usuario },
      include: {
        roles: {
          include: {
            rol: true, // 👈 esto permite acceder a r.rol.nombre
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException('Usuario o clave inválidos');

    const ok = await bcrypt.compare(clave, user.hashClave);
    console.log('🧩 Comparando clave:', clave, 'con hash:', user.hashClave, '=>', ok);

    if (!ok) throw new UnauthorizedException('Usuario o clave inválidos');

    const roles = user.roles.map((r) => r.rol.nombre); // ✅ correcto ahora

    const payload = {
      sub: user.id,
      usuario: user.usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      roles,
    };

    const token = await this.jwt.signAsync(payload);

    await prisma.usuario.update({
      where: { id: user.id },
      data: { ultimoAcceso: new Date() },
    });

    return {
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        roles,
      },
    };
  }

  // 👤 PERFIL
  async perfil(id: number) {
    const user = await prisma.usuario.findUnique({
      where: { id },
      include: {
        roles: { include: { rol: true } },
      },
    });

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const roles = user.roles.map((r) => r.rol.nombre);

    return {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      usuario: user.usuario,
      roles,
    };
  }
}
