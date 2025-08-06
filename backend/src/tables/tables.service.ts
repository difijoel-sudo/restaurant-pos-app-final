import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDto: CreateTableDto) { await this.prisma.tableArea.findUniqueOrThrow({ where: { id: createDto.tableAreaId } }); try { return await this.prisma.table.create({ data: createDto }); } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') { throw new ConflictException(`A table with the name "${createDto.name}" already exists in this area.`); } throw error; } }
  async update(id: number, updateDto: UpdateTableDto) { await this.prisma.table.findUniqueOrThrow({ where: { id } }); return this.prisma.table.update({ where: { id }, data: updateDto }); }
  async remove(id: number) { await this.prisma.table.findUniqueOrThrow({ where: { id } }); return this.prisma.table.delete({ where: { id } }); }
}