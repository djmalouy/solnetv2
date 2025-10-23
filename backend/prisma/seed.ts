import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();


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