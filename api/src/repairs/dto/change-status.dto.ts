import { IsEnum } from 'class-validator';
import { RepairStatus } from './repair-status.type';

export class ChangeStatusDto {
  @IsEnum(['RECIBIDO','DIAGNOSTICO','EN_REPARACION','LISTO','ENTREGADO','CANCELADO'])
  status!: RepairStatus;
}