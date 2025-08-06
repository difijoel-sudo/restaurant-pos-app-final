import { IsArray, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
export class AddItemDto {
  @IsNumber() @IsNotEmpty() menuItemId: number;
  @IsNumber() @IsNotEmpty() @Min(1) quantity: number;
  @IsArray() @IsOptional() modifierIds?: number[];
}