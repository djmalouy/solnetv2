/*import { PrismaClient } from '@prisma/client';
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
nombre: 'Super', apellido: 'Admin', usuario: 'admin', telefono: '',
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


main().finally(() => prisma.$disconnect());*/

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1️⃣ Crear o actualizar el rol ADMIN
  const adminRol = await prisma.rol.upsert({
    where: { nombre: 'ADMIN' },
    update: {},
    create: {
      nombre: 'ADMIN',
      descripcion: 'Rol administrador con todos los permisos',
    },
  });

  // 2️⃣ Crear usuario admin sin roles aún
  const adminUser = await prisma.usuario.upsert({
    where: { usuario: 'admin' },
    update: {},
    create: {
      nombre: 'Super',
      apellido: 'Admin',
      usuario: 'admin',
      hashClave: await bcrypt.hash('admin123', 10),
      activo: true,
    },
  });

  // 3️⃣ Asignar el rol al usuario (tabla intermedia)
  await prisma.usuariosRoles.upsert({
    where: {
      id_usuario_id_rol: {
        id_usuario: adminUser.id,
        id_rol: adminRol.id,
      },
    },
    update: {},
    create: {
      id_usuario: adminUser.id,
      id_rol: adminRol.id,
    },
  });

  console.log('✅ Seed listo. Usuario admin/admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
