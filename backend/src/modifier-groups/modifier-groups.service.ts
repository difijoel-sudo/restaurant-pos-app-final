import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModifierGroupDto } from './dto/create-modifier-group.dto';
import { UpdateModifierGroupDto } from './dto/update-modifier-group.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class ModifierGroupsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDto: CreateModifierGroupDto) { try { return await this.prisma.modifierGroup.create({ data: createDto }); } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') { throw new ConflictException(`A modifier group with the name "${createDto.name}" already exists.`); } throw error; } }
  findAll() { return this.prisma.modifierGroup.findMany({ include: { modifiers: true } }); }
  async update(id: number, updateDto: UpdateModifierGroupDto) { await this.prisma.modifierGroup.findUniqueOrThrow({ where: { id } }); return this.prisma.modifierGroup.update({ where: { id }, data: updateDto }); }
  async remove(id: number) { await this.prisma.modifierGroup.findUniqueOrThrow({ where: { id } }); return this.prisma.modifierGroup.delete({ where: { id } }); }
}