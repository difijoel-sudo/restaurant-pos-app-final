import { IsNotEmpty, IsString } from 'class-validator';
export class SettleOrderDto {
  @IsString() @IsNotEmpty() paymentMode: string; // e.g., CASH, CARD
}