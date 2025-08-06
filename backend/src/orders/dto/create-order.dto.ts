import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { OrderType } from '@prisma/client';
export class CreateOrderDto {
  @IsEnum(OrderType) orderType: OrderType;
  @IsNumber() @IsOptional() tableId?: number;
  @IsNumber() @IsOptional() customerId?: number;
}