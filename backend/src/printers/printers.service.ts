import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class PrintersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDto: CreatePrinterDto) { try { return await this.prisma.printer.create({ data: createDto }); } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') { throw new ConflictException(`A printer with the name "${createDto.name}" already exists.`); } throw error; } }
  findAll() { return this.prisma.printer.findMany(); }
  async update(id: number, updateDto: UpdatePrinterDto) { await this.prisma.printer.findUniqueOrThrow({ where: { id } }); return this.prisma.printer.update({ where: { id }, data: updateDto }); }
  async remove(id: number) { await this.prisma.printer.findUniqueOrThrow({ where: { id } }); return this.prisma.printer.delete({ where: { id } }); }
}