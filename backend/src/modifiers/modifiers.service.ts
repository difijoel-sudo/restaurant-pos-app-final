import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModifierDto } from './dto/create-modifier.dto';
import { UpdateModifierDto } from './dto/update-modifier.dto';
@Injectable()
export class ModifiersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDto: CreateModifierDto) { await this.prisma.modifierGroup.findUniqueOrThrow({ where: { id: createDto.modifierGroupId } }); return this.prisma.modifier.create({ data: createDto }); }
  async update(id: number, updateDto: UpdateModifierDto) { await this.prisma.modifier.findUniqueOrThrow({ where: { id } }); return this.prisma.modifier.update({ where: { id }, data: updateDto }); }
  async remove(id: number) { await this.prisma.modifier.findUniqueOrThrow({ where: { id } }); return this.prisma.modifier.delete({ where: { id } }); }
}