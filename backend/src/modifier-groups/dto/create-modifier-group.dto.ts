import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ModifierGroupType } from '@prisma/client';
export class CreateModifierGroupDto {
  @IsString() @IsNotEmpty() @MinLength(3) name: string;
  @IsEnum(ModifierGroupType) @IsNotEmpty() type: ModifierGroupType;
}