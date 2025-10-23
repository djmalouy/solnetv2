import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


@Injectable()
export class ConfiguracionesService {
porGrupo(grupo: string) {
return prisma.configuracion.findMany({ where: { grupo, activo: true }, orderBy: { valor: 'asc' } });
}
async upsert(data: { grupo: string; clave: string; valor: string; activo?: boolean }) {
const { grupo, clave, valor, activo = true } = data;
return prisma.configuracion.upsert({
where: { grupo_clave: { grupo, clave } },
update: { valor, activo },
create: { grupo, clave, valor, activo }
});
}
}