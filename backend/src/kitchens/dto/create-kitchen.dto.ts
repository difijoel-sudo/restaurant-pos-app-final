import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateKitchenDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}