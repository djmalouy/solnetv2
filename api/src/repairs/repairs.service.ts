import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { RepairStatus } from './dto/repair-status.type';

const prisma = new PrismaClient();

const ALLOWED: Record<RepairStatus, RepairStatus[]> = {
  RECIBIDO: ['DIAGNOSTICO', 'CANCELADO'],
  DIAGNOSTICO: ['EN_REPARACION', 'CANCELADO'],
  EN_REPARACION: ['LISTO', 'CANCELADO'],
  LISTO: ['ENTREGADO', 'CANCELADO'],
  ENTREGADO: [],
  CANCELADO: [],
};

@Injectable()
export class RepairsService {

  async list(params: {
    q?: string;
    page?: number;
    pageSize?: number;
    status?: RepairStatus;
    branchId?: number;
    customerId?: number;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const {
      q,
      status,
      branchId,
      customerId,
      dateFrom,
      dateTo,
      page = 1,
      pageSize = 50,
    } = params;

    const where: any = { deletedAt: null };

    // 🔍 búsqueda por texto o número
    if (q) {
      where.OR = [
        ...(Number.isFinite(Number(q)) ? [{ id: Number(q) }] : []),
        { customer: { firstName: { contains: q } } },
        { customer: { lastName: { contains: q } } },
        { device: { contains: q } },
        { notes: { contains: q } },
      ];
    }

    // 🔹 filtros directos
    if (status) where.status = status;
    if (branchId) where.branchId = branchId;
    if (customerId) where.customerId = customerId;

    // 🔹 rango de fechas (createdAt)
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [items, total] = await Promise.all([
      prisma.repair.findMany({
        where,
        include: {
          customer: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { id: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.repair.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }


  async assertRefs(customerId: number, branchId: number) {
    const [cust, branch] = await Promise.all([
      prisma.customer.findFirst({ where: { id: customerId, deletedAt: null } }),
      prisma.branch.findUnique({ where: { id: branchId } }),
    ]);
    if (!cust) throw new BadRequestException('Cliente inexistente o eliminado');
    if (!branch) throw new BadRequestException('Sucursal inexistente');
  }

  async create(dto: CreateRepairDto) {
    dto.branchId = dto.branchId ?? 1;
    await this.assertRefs(dto.customerId, dto.branchId);
    return prisma.repair.create({
      data: {
        customerId: dto.customerId,
        branchId: dto.branchId,
        device: dto.device,
        notes: dto.notes ?? null,
        status: dto.status ?? 'RECIBIDO',
        deposit: dto.deposit ?? null,
        total: dto.total ?? null,
        currency: dto.currency ?? 'UYU',
      },
    });
  }

  async update(id: number, dto: UpdateRepairDto) {
    const exists = await prisma.repair.findFirst({ where: { id, deletedAt: null } });
    if (!exists) throw new NotFoundException('Repair not found');

    if (dto.customerId || dto.branchId) {
      await this.assertRefs(dto.customerId ?? exists.customerId, dto.branchId ?? exists.branchId);
    }

    return prisma.repair.update({
      where: { id },
      data: {
        customerId: dto.customerId ?? undefined,
        branchId: dto.branchId ?? undefined,
        device: dto.device ?? undefined,
        notes: dto.notes ?? undefined,
        deposit: dto.deposit ?? undefined,
        total: dto.total ?? undefined,
        currency: dto.currency ?? undefined,
        status: dto.status ?? undefined,
      },
    });
  }

  async changeStatus(id: number, next: RepairStatus) {
    const r = await prisma.repair.findFirst({ where: { id, deletedAt: null } });
    if (!r) throw new NotFoundException('Repair not found');

    const allowed = ALLOWED[r.status as RepairStatus] || [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(`Transición inválida: ${r.status} → ${next}`);
    }

    const data: any = { status: next };
    if (next === 'LISTO') data.readyAt = new Date();
    return prisma.repair.update({ where: { id }, data });
  }

  async softDelete(id: number) {
    const r = await prisma.repair.findFirst({ where: { id, deletedAt: null } });
    if (!r) throw new NotFoundException('Repair not found');
    return prisma.repair.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}