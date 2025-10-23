import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleItemDto {
  @IsString() @IsNotEmpty() sku!: string;
  @IsString() @IsNotEmpty() name!: string;
  @IsInt() qty!: number;
  @IsNumber() unitPrice!: number;
  @IsNumber() subTotal!: number;
}

export class CreateSaleDto {
  @IsOptional() @IsInt() customerId?: number;
  @IsOptional() @IsInt() branchId?: number;
  @IsNumber() subtotal!: number;
  @IsNumber() tax!: number;
  @IsNumber() total!: number;
  @IsOptional() @IsString() currency?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items!: CreateSaleItemDto[];
}
