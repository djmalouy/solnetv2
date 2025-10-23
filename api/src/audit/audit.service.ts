import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


@Injectable()
export class AuditService {
log(params: { userId?: number; ip?: string; action: string; entity: string; entityId?: string; details?: string }) {
return prisma.auditLog.create({ data: params });
}
}