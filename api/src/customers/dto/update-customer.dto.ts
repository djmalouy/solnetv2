import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsInt() branchId?: number;
}