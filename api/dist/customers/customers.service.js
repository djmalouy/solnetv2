"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let CustomersService = class CustomersService {
    async list(params) {
        const { q, page = 1, pageSize = 50 } = params;
        const where = {
            deletedAt: null,
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
    async create(data) {
        var _a, _b;
        if (!((_a = data.firstName) === null || _a === void 0 ? void 0 : _a.trim()) || !((_b = data.lastName) === null || _b === void 0 ? void 0 : _b.trim())) {
            throw new common_1.BadRequestException('Nombre y apellido requeridos');
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
    async update(id, dto) {
        const exists = await prisma.customer.findFirst({ where: { id, deletedAt: null } });
        if (!exists)
            throw new common_1.NotFoundException('Customer not found');
        return prisma.customer.update({ where: { id }, data: dto });
    }
    async softDelete(id) {
        const exists = await prisma.customer.findFirst({ where: { id, deletedAt: null } });
        if (!exists)
            throw new common_1.NotFoundException('Customer not found');
        return prisma.customer.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    async findOne(id) {
        return prisma.customer.findUnique({
            where: { id },
            include: { branch: true },
        });
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)()
], CustomersService);
