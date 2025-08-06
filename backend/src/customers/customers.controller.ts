import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  @Post() create(@Body() createDto: CreateCustomerDto) { return this.customersService.create(createDto); }
  @Get() findAll() { return this.customersService.findAll(); }
  @Get('search/:phone') findByPhone(@Param('phone') phone: string) { return this.customersService.findByPhone(phone); }
}