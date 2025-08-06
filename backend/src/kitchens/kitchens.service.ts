import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKitchenDto } from './dto/create-kitchen.dto';
import { UpdateKitchenDto } from './dto/update-kitchen.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class KitchensService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createKitchenDto: CreateKitchenDto) { try { return await this.prisma.kitchen.create({ data: createKitchenDto }); } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') { throw new ConflictException(`A kitchen with the name "${createKitchenDto.name}" already exists.`); } throw error; } }
  findAll() { return this.prisma.kitchen.findMany(); }
  async update(id: number, updateKitchenDto: UpdateKitchenDto) { await this.prisma.kitchen.findUniqueOrThrow({ where: { id } }); return this.prisma.kitchen.update({ where: { id }, data: updateKitchenDto }); }
  async remove(id: number) { await this.prisma.kitchen.findUniqueOrThrow({ where: { id } }); return this.prisma.kitchen.delete({ where: { id } }); }
}