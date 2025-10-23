"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguracionesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let ConfiguracionesService = class ConfiguracionesService {
    porGrupo(grupo) {
        return prisma.configuracion.findMany({ where: { grupo, activo: true }, orderBy: { valor: 'asc' } });
    }
    async upsert(data) {
        const { grupo, clave, valor, activo = true } = data;
        return prisma.configuracion.upsert({
            where: { grupo_clave: { grupo, clave } },
            update: { valor, activo },
            create: { grupo, clave, valor, activo }
        });
    }
};
exports.ConfiguracionesService = ConfiguracionesService;
exports.ConfiguracionesService = ConfiguracionesService = __decorate([
    (0, common_1.Injectable)()
], ConfiguracionesService);
