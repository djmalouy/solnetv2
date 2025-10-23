import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { AuditService } from '../audit/audit.service';

@Controller('sales')
export class SalesController {
  constructor(private svc: SalesService, private audit: AuditService) {}

  @Get()
  async list(
    @Query('q') q?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(50), ParseIntPipe) pageSize?: number,
    @Query('customerId') customerId?: number, // 👈 agregado
  ) {
    return this.svc.list({ q, page, pageSize, customerId });
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }
  
  @Post()
  async create(@Body() dto: CreateSaleDto, @Req() req: any) {
    const created = await this.svc.create(dto);
    await this.audit.log({
      userId: req.user?.sub,
      ip: req.ip,
      action: 'create',
      entity: 'sale',
      entityId: String(created.id),
      details: JSON.stringify(dto),
    });
    return created;
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSaleDto, @Req() req: any) {
    const updated = await this.svc.update(id, dto);
    await this.audit.log({
      userId: req.user?.sub,
      ip: req.ip,
      action: 'update',
      entity: 'sale',
      entityId: String(id),
      details: JSON.stringify(dto),
    });
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const deleted = await this.svc.remove(id);
    await this.audit.log({
      userId: req.user?.sub,
      ip: req.ip,
      action: 'delete',
      entity: 'sale',
      entityId: String(id),
    });
    return deleted;
  }
}
