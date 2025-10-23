import { Controller, Get } from '@nestjs/common';

@Controller('usuarios')
export class UsuariosController {
  @Get()
  findAll() {
    return 'Lista de usuarios';
  }
}