import { Module } from '@nestjs/common';
import { RepairsService } from './repairs.service';
import { RepairsController } from './repairs.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [RepairsController],
  providers: [RepairsService],
})
export class RepairsModule {}
