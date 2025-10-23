import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { RepairStatus } from './repair-status.type';

export class CreateRepairDto {
  @IsInt()
  customerId!: number;

  @IsInt()
  branchId!: number;

  @IsString()
  @IsNotEmpty()
  device!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  deposit?: number;

  @IsOptional()
  @IsNumber()
  total?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(['RECIBIDO','DIAGNOSTICO','EN_REPARACION','LISTO','ENTREGADO','CANCELADO'])
  status?: RepairStatus;
}