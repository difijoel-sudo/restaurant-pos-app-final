import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateGstDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  cgstRate: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  sgstRate: number;
}