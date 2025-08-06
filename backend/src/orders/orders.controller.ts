import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddItemDto } from './dto/add-item.dto';
import { SettleOrderDto } from './dto/settle-order.dto';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post() create(@Body() createDto: CreateOrderDto, @Request() req) { return this.ordersService.create(createDto, req.user.id); }
  @Get() findAllOpen() { return this.ordersService.findAllOpen(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.ordersService.findOne(id); }
  @Post(':id/add-item') addItem(@Param('id', ParseIntPipe) id: number, @Body() addItemDto: AddItemDto) { return this.ordersService.addItem(id, addItemDto); }
  @Post(':id/apply-promo/:code') applyPromo(@Param('id', ParseIntPipe) id: number, @Param('code') code: string) { return this.ordersService.applyPromoCode(id, code); }
  @Post(':id/settle') settle(@Param('id', ParseIntPipe) id: number, @Body() settleDto: SettleOrderDto, @Request() req) { return this.ordersService.settleOrder(id, settleDto, req.user.id); }
}