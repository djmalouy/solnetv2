import { IsEnum, IsInt, IsOptional, IsString, IsNumber } from 'class-validator';
import { RepairStatus } from './repair-status.type';

export class UpdateRepairDto {
  @IsOptional() @IsInt()
  customerId?: number;

  @IsOptional() @IsInt()
  branchId?: number;

  @IsOptional() @IsString()
  device?: string;

  @IsOptional() @IsString()
  notes?: string;

  @IsOptional() @IsNumber()
  deposit?: number;

  @IsOptional() @IsNumber()
  total?: number;

  @IsOptional() @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(['RECIBIDO','DIAGNOSTICO','EN_REPARACION','LISTO','ENTREGADO','CANCELADO'])
  status?: RepairStatus;
}