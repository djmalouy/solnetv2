"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let SalesService = class SalesService {
    async list(params) {
        const { q, page = 1, pageSize = 50, customerId } = params;
        const where = {};
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
    async findOne(id) {
        const sale = await prisma.sale.findUnique({
            where: { id },
            include: {
                customer: { select: { id: true, firstName: true, lastName: true } },
                branch: { select: { name: true } },
                items: true,
            },
        });
        if (!sale)
            throw new common_1.NotFoundException("Sale not found");
        return sale;
    }
    async create(dto) {
        var _a, _b, _c, _d;
        if (!dto.branchId)
            dto.branchId = 1;
        if (((_a = dto.items) === null || _a === void 0 ? void 0 : _a.length) === 0)
            throw new common_1.BadRequestException('Sale must contain items');
        const sale = await prisma.sale.create({
            data: {
                customerId: (_b = dto.customerId) !== null && _b !== void 0 ? _b : null,
                branchId: dto.branchId,
                subtotal: dto.subtotal,
                tax: dto.tax,
                total: dto.total,
                currency: (_c = dto.currency) !== null && _c !== void 0 ? _c : 'UYU',
                items: {
                    create: ((_d = dto.items) !== null && _d !== void 0 ? _d : []).map((i) => ({
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
    async update(id, dto) {
        var _a, _b, _c, _d, _e, _f;
        const exists = await prisma.sale.findUnique({ where: { id } });
        if (!exists)
            throw new common_1.NotFoundException('Sale not found');
        const data = {
            customerId: (_a = dto.customerId) !== null && _a !== void 0 ? _a : undefined,
            branchId: (_b = dto.branchId) !== null && _b !== void 0 ? _b : undefined,
            subtotal: (_c = dto.subtotal) !== null && _c !== void 0 ? _c : undefined,
            tax: (_d = dto.tax) !== null && _d !== void 0 ? _d : undefined,
            total: (_e = dto.total) !== null && _e !== void 0 ? _e : undefined,
            currency: (_f = dto.currency) !== null && _f !== void 0 ? _f : undefined,
        };
        return prisma.sale.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        const exists = await prisma.sale.findUnique({ where: { id } });
        if (!exists)
            throw new common_1.NotFoundException('Sale not found');
        return prisma.sale.delete({ where: { id } });
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)()
], SalesService);
