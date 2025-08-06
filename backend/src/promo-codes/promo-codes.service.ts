import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class PromoCodesService {
  constructor(private readonly prisma: PrismaService) {}
  // ... (keep create, findAll, update, remove)
  async create(createDto: CreatePromoCodeDto) { try { return await this.prisma.promoCode.create({ data: { ...createDto, expiryDate: createDto.expiryDate ? new Date(createDto.expiryDate) : null, } }); } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') { throw new ConflictException(`A promo code with the code "${createDto.code}" already exists.`); } throw error; } }
  findAll() { return this.prisma.promoCode.findMany(); }
  async update(id: number, updateDto: UpdatePromoCodeDto) { await this.prisma.promoCode.findUniqueOrThrow({ where: { id } }); const data = { ...updateDto, expiryDate: updateDto.expiryDate ? new Date(updateDto.expiryDate) : null, }; return this.prisma.promoCode.update({ where: { id }, data }); }
  async remove(id: number) { await this.prisma.promoCode.findUniqueOrThrow({ where: { id } }); return this.prisma.promoCode.delete({ where: { id } }); }

  async validatePromoCode(code: string) {
    const promo = await this.prisma.promoCode.findFirst({
      where: {
        code: { equals: code, mode: 'insensitive' },
        status: 'ACTIVE',
        OR: [{ expiryDate: null }, { expiryDate: { gte: new Date() } }],
      },
    });
    if (!promo) {
      throw new NotFoundException('Promo code is invalid or has expired.');
    }
    return promo;
  }
}