import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


@Injectable()
export class UsersService {
async findByUsername(username: string) {
return prisma.user.findUnique({ where: { username } });
}


async getUserPermissions(userId: number) {
const roles = await prisma.userRole.findMany({ where: { userId }, include: { role: { include: { perms: { include: { perm: true } } } } } });
const set = new Set<string>();
roles.forEach(ur => ur.role.perms.forEach(rp => set.add(rp.perm.code)));
return [...set];
}
}