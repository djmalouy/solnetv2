import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { AuditService } from '../audit/audit.service';

@Module({
  controllers: [SalesController],
  providers: [SalesService, AuditService],
  exports: [SalesService],
})
export class SalesModule {}
