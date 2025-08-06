import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
export class CreateTableDto {
  @IsString() @IsNotEmpty() @MinLength(1) name: string;
  @IsNumber() @IsNotEmpty() tableAreaId: number;
}