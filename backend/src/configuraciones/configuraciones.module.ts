import { Module } from '@nestjs/common';
import { ConfiguracionesController } from './configuraciones.controller';
import { ConfiguracionesService } from './configuraciones.service';


@Module({ controllers: [ConfiguracionesController], providers: [ConfiguracionesService] })
export class ConfiguracionesModule {}