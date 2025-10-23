import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ConfiguracionesService } from './configuraciones.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('configuraciones')
export class ConfiguracionesController {
constructor(private readonly svc: ConfiguracionesService) {}


@Get()
porGrupo(@Query('grupo') grupo: string) {
return this.svc.porGrupo(grupo);
}


@Post()
upsert(@Body() data: { grupo: string; clave: string; valor: string; activo?: boolean }) {
return this.svc.upsert(data);
}
}