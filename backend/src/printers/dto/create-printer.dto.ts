import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { PrinterConnectionType } from '@prisma/client';
export class CreatePrinterDto {
  @IsString() @IsNotEmpty() @MinLength(3) name: string;
  @IsEnum(PrinterConnectionType) @IsNotEmpty() connectionType: PrinterConnectionType;
  @IsString() @IsNotEmpty() path: string; // IP Address or Share Path
}