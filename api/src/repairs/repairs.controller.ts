import {
  Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe,
  Patch, Post, Put, Query, Req, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RepairsService } from './repairs.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { Perms } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AuditService } from '../audit/audit.service';
import { RepairStatus } from './dto/repair-status.type';

@Controller('repairs')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class RepairsController {
  constructor(private svc: RepairsService, private audit: AuditService) {}

  @Get()
  @Perms('repair.read')
  async list(
    @Query('q') q?: string,
    @Query('status') status?: RepairStatus,
    @Query('branchId') branchId?: number,
    @Query('customerId') customerId?: number,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page', new DefaultValuePipe(1)) page?: number,
    @Query('pageSize', new DefaultValuePipe(20)) pageSize?: number,
  ) {
    return this.svc.list({
      q,
      status: status as any,
      branchId: branchId ? Number(branchId) : undefined,
      customerId: customerId ? Number(customerId) : undefined,
      dateFrom,
      dateTo,
      page: Number(page),
      pageSize: Number(pageSize),
    });
  }

  @Post()
  @Perms('repair.create')
  async create(@Body() dto: CreateRepairDto, @Req() req: any) {
    const created = await this.svc.create(dto);
    await this.audit.log({
      userId: req.user?.sub, ip: req.ip,
      action: 'create', entity: 'repair', entityId: String(created.id),
      details: JSON.stringify(dto),
    });
    return created;
  }

  @Put(':id')
  @Perms('repair.update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRepairDto, @Req() req: any) {
    const updated = await this.svc.update(id, dto);
    await this.audit.log({
      userId: req.user?.sub, ip: req.ip,
      action: 'update', entity: 'repair', entityId: String(id),
      details: JSON.stringify(dto),
    });
    return updated;
  }

  @Patch(':id/status')
  @Perms('repair.update')
  async changeStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: ChangeStatusDto, @Req() req: any) {
    const updated = await this.svc.changeStatus(id, dto.status);
    await this.audit.log({
      userId: req.user?.sub, ip: req.ip,
      action: 'status', entity: 'repair', entityId: String(id),
      details: JSON.stringify({ to: dto.status }),
    });
    return updated;
  }

  @Delete(':id')
  @Perms('repair.delete')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    await this.svc.softDelete(id);
    await this.audit.log({
      userId: req.user?.sub, ip: req.ip,
      action: 'delete', entity: 'repair', entityId: String(id),
    });
    return { ok: true };
  }
}
