import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RbacModule } from './rbac/rbac.module';
import { AuditModule } from './audit/audit.module';
import { CustomersModule } from './customers/customers.module';
import { RepairsModule } from './repairs/repairs.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [AuthModule, UsersModule, RbacModule, AuditModule, CustomersModule, RepairsModule, SalesModule,],
})

export class AppModule {}