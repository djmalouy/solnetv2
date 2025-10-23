import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class ClientesService {
  buscar(buscar?: string) {
    return prisma.cliente.findMany({
      where: buscar
        ? {
            OR: [
              { nombre: { contains: buscar } },
              { apellido: { contains: buscar } },
              { email: { contains: buscar } },
              { telefono: { contains: buscar } },
            ],
          }
        : undefined,
      orderBy: { id: 'desc' },
    });
  }

  crear(data: any) {
    return prisma.cliente.create({ data });
  }
}
