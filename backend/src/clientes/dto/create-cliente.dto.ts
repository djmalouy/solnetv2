import { IsString, IsOptional } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  nombre!: string;

  @IsString()
  apellido!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}
