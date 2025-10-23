import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.usuario, dto.clave);
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  perfil(@Req() req: Request) {
    return this.auth.perfil((req as any).user.id);
  }
}
