import { IsOptional, IsString, MinLength } from 'class-validator';
export class CreateInvoiceTemplateDto {
  @IsString() @MinLength(3) restaurantName: string;
  @IsString() @IsOptional() address?: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() gstin?: string;
  @IsString() @IsOptional() footerText?: string;
  @IsString() @IsOptional() logoUrl?: string;
}