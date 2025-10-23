import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClientesController {
constructor(private readonly svc: ClientesService) {}


@Get()
buscar(@Query('buscar') buscar?: string) {
return this.svc.buscar(buscar);
}


@Post()
crear(@Body() data: any) {
return this.svc.crear(data);
}
}