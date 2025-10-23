import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

const prisma = new PrismaClient();

@Injectable()

export class SalesService {

    async list(params: { q?: string; page?: number; pageSize?: number; customerId?: number }) {
        const { q, page = 1, pageSize = 50, customerId } = params;

        const where: any = {};

        if (q) {
            where.OR = [
            ...(Number.isFinite(Number(q)) ? [{ id: Number(q) }] : []),
            { customer: { firstName: { contains: q } } },
            { customer: { lastName: { contains: q } } },
            ];
        }

        if (customerId) {
            where.customerId = customerId; // 👈 filtro adicional
        }

        const [items, total] = await Promise.all([
            prisma.sale.findMany({
            where,
            include: {
                customer: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { id: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
            }),
            prisma.sale.count({ where }),
        ]);

        return { items, total, page, pageSize };
    }

    async findOne(id: number) {
    const sale = await prisma.sale.findUnique({
        where: { id },
        include: {
        customer: { select: { id: true, firstName: true, lastName: true } },
        branch: { select: { name: true } },
        items: true,
        },
    });

    if (!sale) throw new NotFoundException("Sale not found");
    return sale;
    }


    async create(dto: CreateSaleDto) {
        if (!dto.branchId) dto.branchId = 1;
        if (dto.items?.length === 0) throw new BadRequestException('Sale must contain items');

        const sale = await prisma.sale.create({
        data: {
            customerId: dto.customerId ?? null,
            branchId: dto.branchId,
            subtotal: dto.subtotal,
            tax: dto.tax,
            total: dto.total,
            currency: dto.currency ?? 'UYU',
            items: {
            create: (dto.items ?? []).map((i) => ({
                sku: i.sku,
                name: i.name,
                qty: i.qty,
                unitPrice: i.unitPrice,
                subTotal: i.subTotal,
            })),
            },
        },
        include: { items: true },
        });

        return sale;
    }

    async update(id: number, dto: UpdateSaleDto) {
        const exists = await prisma.sale.findUnique({ where: { id } });
        if (!exists) throw new NotFoundException('Sale not found');

        const data: any = {
            customerId: dto.customerId ?? undefined,
            branchId: dto.branchId ?? undefined,
            subtotal: dto.subtotal ?? undefined,
            tax: dto.tax ?? undefined,
            total: dto.total ?? undefined,
            currency: dto.currency ?? undefined,
        };

        return prisma.sale.update({
            where: { id },
            data,
        });
    }

    async remove(id: number) {
        const exists = await prisma.sale.findUnique({ where: { id } });
        if (!exists) throw new NotFoundException('Sale not found');
        return prisma.sale.delete({ where: { id } });
    }
}
