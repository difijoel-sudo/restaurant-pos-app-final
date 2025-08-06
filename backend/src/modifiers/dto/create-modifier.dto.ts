import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from 'class-validator';
export class CreateModifierDto {
  @IsString() @IsNotEmpty() @MinLength(1) name: string;
  @IsNumber() @IsNotEmpty() @Min(0) price: number;
  @IsNumber() @IsNotEmpty() modifierGroupId: number;
}