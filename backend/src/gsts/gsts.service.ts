import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGstDto } from './dto/create-gst.dto';
import { UpdateGstDto } from './dto/update-gst.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class GstsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGstDto: CreateGstDto) {
    try {
      return await this.prisma.gstSlab.create({ data: createGstDto });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`A GST slab with the name "${createGstDto.name}" already exists.`);
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.gstSlab.findMany();
  }

  async update(id: number, updateGstDto: UpdateGstDto) {
    await this.prisma.gstSlab.findUniqueOrThrow({ where: { id } });
    return this.prisma.gstSlab.update({ where: { id }, data: updateGstDto });
  }

  async remove(id: number) {
    await this.prisma.gstSlab.findUniqueOrThrow({ where: { id } });
    return this.prisma.gstSlab.delete({ where: { id } });
  }
}
