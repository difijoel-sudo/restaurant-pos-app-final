import { Type } from 'class-transformer';
import { IsArray, IsIP, IsNotEmpty, IsNumber, IsString, MinLength, ValidateNested } from 'class-validator';

class KitchenPrinterMapDto {
    @IsNumber()
    @IsNotEmpty()
    kitchenId: number;

    @IsNumber()
    @IsNotEmpty()
    printerId: number;
}

export class CreateTerminalDto {
  @IsString() @IsNotEmpty() @MinLength(3) name: string;
  @IsIP() @IsNotEmpty() ipAddress: string;
  @IsNumber() @IsNotEmpty() defaultBillPrinterId: number;
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KitchenPrinterMapDto)
  kitchenPrinterMap: KitchenPrinterMapDto[];
}