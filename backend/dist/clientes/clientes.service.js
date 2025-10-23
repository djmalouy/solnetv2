"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let ClientesService = class ClientesService {
    buscar(buscar) {
        return prisma.cliente.findMany({
            where: buscar ? {
                OR: [
                    { nombre: { contains: buscar } },
                    { apellido: { contains: buscar } },
                    { email: { contains: buscar } },
                    { telefono: { contains: buscar } }
                ]
            } : undefined,
            orderBy: { id: 'desc' }
        });
    }
    crear(data) {
        return prisma.cliente.create({ data });
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)()
], ClientesService);
