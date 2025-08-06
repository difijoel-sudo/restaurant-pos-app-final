import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMenuItemDto {
  @IsString() @IsNotEmpty() @MinLength(3) name: string;
  @IsString() @IsOptional() description?: string;
  @IsNumber() @IsNotEmpty() price: number;
  @IsString() @IsOptional() barcode?: string;
  @IsNumber() @IsOptional() gstSlabId?: number;
  @IsNumber() @IsOptional() kitchenId?: number;
  @IsNumber() @IsNotEmpty() categoryId: number;

 
  @IsArray()
  @IsOptional()
  modifierGroupIds?: number[];
}