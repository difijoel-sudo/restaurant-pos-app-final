import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { DiscountType, PromoCodeStatus } from '@prisma/client';
export class CreatePromoCodeDto {
  @IsString() @IsNotEmpty() @MinLength(4) code: string;
  @IsEnum(DiscountType) @IsNotEmpty() discountType: DiscountType;
  @IsNumber() @IsNotEmpty() @Min(0) value: number;
  @IsDateString() @IsOptional() expiryDate?: string;
  @IsEnum(PromoCodeStatus) @IsOptional() status?: PromoCodeStatus;
}