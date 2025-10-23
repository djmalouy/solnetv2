import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { ConfiguracionesModule } from './configuraciones/configuraciones.module';


@Module({
imports: [AuthModule, UsuariosModule, ClientesModule, ConfiguracionesModule],
})
export class AppModule {}