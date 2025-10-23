import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();


async function main() {
const username = process.env.ADMIN_USERNAME || "Administrador";
const password = process.env.ADMIN_PASSWORD || "Cambiar.Esta.Clave!";


// Empresa y sucursal por defecto
const company = await prisma.company.upsert({
where: { id: 1 },
update: {},
create: { id: 1, name: process.env.COMPANY_NAME || "Empresa" },
});


const branch = await prisma.branch.upsert({
where: { id: 1 },
update: {},
create: { id: 1, name: "Casa Central", address: "", companyId: company.id },
});


// Roles y permisos base
const [adminRole] = await Promise.all([
prisma.role.upsert({ where: { name: "admin" }, update: {}, create: { name: "admin" } }),
]);


const perms = [
"customer.read","customer.create","customer.update","customer.delete",
"repair.read","repair.create","repair.update","repair.delete",
"sale.read","sale.create","sale.update","sale.delete",
"rbac.manage","audit.read"
];
for (const code of perms) {
const p = await prisma.permission.upsert({ where: { code }, update: {}, create: { code } });
await prisma.rolePermission.upsert({
where: { roleId_permId: { roleId: adminRole.id, permId: p.id } },
update: {},
create: { roleId: adminRole.id, permId: p.id },
});
}


// Administrador inmutable
const hash = await argon2.hash(password, { type: argon2.argon2id });
const admin = await prisma.user.upsert({
where: { username },
update: {},
create: {
username,
email: null,
passwordHash: hash,
isActive: true,
isImmutable: true,
branchId: branch.id,
},
});


await prisma.userRole.upsert({
where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
update: {},
create: { userId: admin.id, roleId: adminRole.id },
});


console.log("Seed completado. Admin:", username);
}


main().finally(async () => prisma.$disconnect());