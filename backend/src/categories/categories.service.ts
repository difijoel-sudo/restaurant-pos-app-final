import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) { try { return await this.prisma.category.create({ data: createCategoryDto }); } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') { throw new ConflictException(`A category with the name "${createCategoryDto.name}" already exists.`); } throw error; } }
  findAll() { return this.prisma.category.findMany(); }
  async update(id: number, updateCategoryDto: UpdateCategoryDto) { await this.prisma.category.findUniqueOrThrow({ where: { id } }); return this.prisma.category.update({ where: { id }, data: updateCategoryDto }); }
  async remove(id: number) { await this.prisma.category.findUniqueOrThrow({ where: { id } }); return this.prisma.category.delete({ where: { id } }); }
}