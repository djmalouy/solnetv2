import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Perms } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AuditService } from '../audit/audit.service';

@Controller('customers')
//@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class CustomersController {
  constructor(private svc: CustomersService, private audit: AuditService) {}

  @Get()
  @Perms('customer.read')
  async list(
    @Query('q') q?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize?: number,
  ) {
    return this.svc.list({ q, page, pageSize });
  }

  @Post()
  @Perms('customer.create')
  async create(@Body() dto: CreateCustomerDto, @Req() req: any) {
    const created = await this.svc.create(dto);
    await this.audit.log({
      userId: req.user?.sub,
      ip: req.ip,
      action: 'create',
      entity: 'customer',
      entityId: String(created.id),
      details: JSON.stringify(dto),
    });
    return created;
  }

  @Put(':id')
  @Perms('customer.update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCustomerDto, @Req() req: any) {
    const updated = await this.svc.update(id, dto);
    await this.audit.log({
      userId: req.user?.sub,
      ip: req.ip,
      action: 'update',
      entity: 'customer',
      entityId: String(id),
      details: JSON.stringify(dto),
    });
    return updated;
  }

  @Delete(':id')
  @Perms('customer.delete')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const removed = await this.svc.softDelete(id);
    await this.audit.log({
      userId: req.user?.sub,
      ip: req.ip,
      action: 'delete',
      entity: 'customer',
      entityId: String(id),
    });
    return { ok: true };
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }
}