import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';


const prisma = new PrismaClient();

@Injectable()
export class CustomersService {

  async list(params: { q?: string; page?: number; pageSize?: number }) {
    const { q, page = 1, pageSize = 50 } = params;
    const where = {
      deletedAt: null as Date | null,
      ...(q
        ? {
            OR: [
              { firstName: { contains: q } },
              { lastName: { contains: q } },
              { email: { contains: q } },
              { phone: { contains: q } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { id: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: { select: { repairs: true, sales: true } },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    // mapear conteos
    const mapped = items.map((c) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      repairs: c._count.repairs,
      sales: c._count.sales,
    }));

    return { items: mapped, total, page, pageSize };
  }

  async create(data: { firstName: string; lastName: string; email?: string; phone?: string }) {
    if (!data.firstName?.trim() || !data.lastName?.trim()) {
      throw new BadRequestException('Nombre y apellido requeridos');
    }

    // 👇 Asignar automáticamente la sucursal "Casa Central" (id = 1)
    const customer = await prisma.customer.create({
      data: {
        ...data,
        branch: { connect: { id: 1 } }, // 🔧 Conecta el cliente a la sucursal id=1
      },
    });

    return customer;
  }

  async update(id: number, dto: UpdateCustomerDto) {
    const exists = await prisma.customer.findFirst({ where: { id, deletedAt: null } });
    if (!exists) throw new NotFoundException('Customer not found');
    return prisma.customer.update({ where: { id }, data: dto });
  }

  async softDelete(id: number) {
    const exists = await prisma.customer.findFirst({ where: { id, deletedAt: null } });
    if (!exists) throw new NotFoundException('Customer not found');
    return prisma.customer.update({ where: { id }, data: { deletedAt: new Date() } });
  }
  
  async findOne(id: number) {
    return prisma.customer.findUnique({
      where: { id },
      include: { branch: true },
    });
  }
}