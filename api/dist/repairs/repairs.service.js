"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepairsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const ALLOWED = {
    RECIBIDO: ['DIAGNOSTICO', 'CANCELADO'],
    DIAGNOSTICO: ['EN_REPARACION', 'CANCELADO'],
    EN_REPARACION: ['LISTO', 'CANCELADO'],
    LISTO: ['ENTREGADO', 'CANCELADO'],
    ENTREGADO: [],
    CANCELADO: [],
};
let RepairsService = class RepairsService {
    async list(params) {
        const { q, status, branchId, customerId, dateFrom, dateTo, page = 1, pageSize = 50, } = params;
        const where = { deletedAt: null };
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
        if (status)
            where.status = status;
        if (branchId)
            where.branchId = branchId;
        if (customerId)
            where.customerId = customerId;
        // 🔹 rango de fechas (createdAt)
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = new Date(dateFrom);
            if (dateTo)
                where.createdAt.lte = new Date(dateTo);
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
    async assertRefs(customerId, branchId) {
        const [cust, branch] = await Promise.all([
            prisma.customer.findFirst({ where: { id: customerId, deletedAt: null } }),
            prisma.branch.findUnique({ where: { id: branchId } }),
        ]);
        if (!cust)
            throw new common_1.BadRequestException('Cliente inexistente o eliminado');
        if (!branch)
            throw new common_1.BadRequestException('Sucursal inexistente');
    }
    async create(dto) {
        var _a, _b, _c, _d, _e, _f;
        dto.branchId = (_a = dto.branchId) !== null && _a !== void 0 ? _a : 1;
        await this.assertRefs(dto.customerId, dto.branchId);
        return prisma.repair.create({
            data: {
                customerId: dto.customerId,
                branchId: dto.branchId,
                device: dto.device,
                notes: (_b = dto.notes) !== null && _b !== void 0 ? _b : null,
                status: (_c = dto.status) !== null && _c !== void 0 ? _c : 'RECIBIDO',
                deposit: (_d = dto.deposit) !== null && _d !== void 0 ? _d : null,
                total: (_e = dto.total) !== null && _e !== void 0 ? _e : null,
                currency: (_f = dto.currency) !== null && _f !== void 0 ? _f : 'UYU',
            },
        });
    }
    async update(id, dto) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const exists = await prisma.repair.findFirst({ where: { id, deletedAt: null } });
        if (!exists)
            throw new common_1.NotFoundException('Repair not found');
        if (dto.customerId || dto.branchId) {
            await this.assertRefs((_a = dto.customerId) !== null && _a !== void 0 ? _a : exists.customerId, (_b = dto.branchId) !== null && _b !== void 0 ? _b : exists.branchId);
        }
        return prisma.repair.update({
            where: { id },
            data: {
                customerId: (_c = dto.customerId) !== null && _c !== void 0 ? _c : undefined,
                branchId: (_d = dto.branchId) !== null && _d !== void 0 ? _d : undefined,
                device: (_e = dto.device) !== null && _e !== void 0 ? _e : undefined,
                notes: (_f = dto.notes) !== null && _f !== void 0 ? _f : undefined,
                deposit: (_g = dto.deposit) !== null && _g !== void 0 ? _g : undefined,
                total: (_h = dto.total) !== null && _h !== void 0 ? _h : undefined,
                currency: (_j = dto.currency) !== null && _j !== void 0 ? _j : undefined,
                status: (_k = dto.status) !== null && _k !== void 0 ? _k : undefined,
            },
        });
    }
    async changeStatus(id, next) {
        const r = await prisma.repair.findFirst({ where: { id, deletedAt: null } });
        if (!r)
            throw new common_1.NotFoundException('Repair not found');
        const allowed = ALLOWED[r.status] || [];
        if (!allowed.includes(next)) {
            throw new common_1.BadRequestException(`Transición inválida: ${r.status} → ${next}`);
        }
        const data = { status: next };
        if (next === 'LISTO')
            data.readyAt = new Date();
        return prisma.repair.update({ where: { id }, data });
    }
    async softDelete(id) {
        const r = await prisma.repair.findFirst({ where: { id, deletedAt: null } });
        if (!r)
            throw new common_1.NotFoundException('Repair not found');
        return prisma.repair.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.RepairsService = RepairsService;
exports.RepairsService = RepairsService = __decorate([
    (0, common_1.Injectable)()
], RepairsService);
