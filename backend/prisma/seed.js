"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const [adminRol] = await Promise.all([
        prisma.rol.upsert({ where: { nombre: 'ADMIN' }, update: {}, create: { nombre: 'ADMIN', descripcion: 'Acceso total' } }),
    ]);
    const adminUser = await prisma.usuario.upsert({
        where: { usuario: 'admin' },
        update: {},
        create: {
            nombre: 'Super', apellido: 'Admin', email: 'admin@solnet.local', usuario: 'admin', telefono: '',
            hashClave: await bcrypt.hash('admin123', 10), activo: true, roles: { connect: [{ id: adminRol.id }] }
        }
    });
    // Configs de ejemplo
    await prisma.configuracion.createMany({
        data: [
            { grupo: 'estados_reparacion', clave: 'RECIBIDO', valor: 'Recibido' },
            { grupo: 'estados_reparacion', clave: 'DIAGNOSTICO', valor: 'Diagnóstico' },
            { grupo: 'estados_reparacion', clave: 'EN_REPARACION', valor: 'En reparación' },
            { grupo: 'estados_reparacion', clave: 'LISTO', valor: 'Listo' },
            { grupo: 'estados_reparacion', clave: 'ENTREGADO', valor: 'Entregado' },
            { grupo: 'estados_reparacion', clave: 'CANCELADO', valor: 'Cancelado' }
        ],
        skipDuplicates: true
    });
    console.log('✅ Seed listo. Usuario admin/admin123');
}
main().finally(() => prisma.$disconnect());
