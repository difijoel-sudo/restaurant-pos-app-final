import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateTableAreaDto {
  @IsString() @IsNotEmpty() @MinLength(3) name: string;
}