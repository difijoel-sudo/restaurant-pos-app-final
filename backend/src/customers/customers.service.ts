import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}
  create(createDto: CreateCustomerDto) { return this.prisma.customer.upsert({ where: { phone: createDto.phone }, update: { name: createDto.name }, create: createDto }); }
  findAll() { return this.prisma.customer.findMany(); }
  findByPhone(phone: string) { return this.prisma.customer.findMany({ where: { phone: { contains: phone } } }); }
}