import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableAreaDto } from './dto/create-table-area.dto';
import { UpdateTableAreaDto } from './dto/update-table-area.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class TableAreasService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDto: CreateTableAreaDto) { try { return await this.prisma.tableArea.create({ data: createDto }); } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') { throw new ConflictException(`A table area with the name "${createDto.name}" already exists.`); } throw error; } }
  findAll() { return this.prisma.tableArea.findMany({ include: { tables: true } }); }
  async update(id: number, updateDto: UpdateTableAreaDto) { await this.prisma.tableArea.findUniqueOrThrow({ where: { id } }); return this.prisma.tableArea.update({ where: { id }, data: updateDto }); }
  async remove(id: number) { await this.prisma.tableArea.findUniqueOrThrow({ where: { id } }); return this.prisma.tableArea.delete({ where: { id } }); }
}