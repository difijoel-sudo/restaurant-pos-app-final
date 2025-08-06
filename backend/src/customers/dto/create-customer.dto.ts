import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateCustomerDto {
  @IsString() @IsNotEmpty() @MinLength(3) name: string;
  @IsString() @IsNotEmpty() @MinLength(10) phone: string;
}