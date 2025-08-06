import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';
export class CreateUserDto {
  @IsString() @IsNotEmpty() username: string;
  @IsString() @IsNotEmpty() @MinLength(4) password: string;
  @IsEnum(UserRole) role: UserRole;
  @IsEnum(UserStatus) @IsNotEmpty() status: UserStatus;
}