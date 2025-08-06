import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TerminalsService {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(createDto: CreateTerminalDto) {
    const { kitchenPrinterMap, ...terminalData } = createDto;
    try {
      return await this.prisma.terminal.create({
        data: {
          ...terminalData,
          kitchenPrinterMap: {
            create: kitchenPrinterMap.map(mapping => ({
              kitchenId: mapping.kitchenId,
              printerId: mapping.printerId,
            })),
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`A terminal with this name or IP address already exists.`);
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.terminal.findMany({
      include: {
        defaultBillPrinter: true,
        kitchenPrinterMap: {
          include: {
            kitchen: true,
            printer: true,
          },
        },
      },
    });
  }

  async update(id: number, updateDto: UpdateTerminalDto) {
    const { kitchenPrinterMap, ...terminalData } = updateDto;
    await this.prisma.terminal.findUniqueOrThrow({ where: { id } });
    
    return this.prisma.$transaction(async (tx) => {
        await tx.terminalKitchenPrinterMap.deleteMany({ where: { terminalId: id } });

        return tx.terminal.update({
            where: { id },
            data: {
                ...terminalData,
                kitchenPrinterMap: {
                    // --- THIS IS THE FIX ---
                    // We provide an empty array as a fallback if kitchenPrinterMap is undefined.
                    create: (kitchenPrinterMap || []).map(mapping => ({
                        kitchenId: mapping.kitchenId,
                        printerId: mapping.printerId,
                    })),
                },
            },
        });
    });
  }

  async remove(id: number) {
    await this.prisma.terminal.findUniqueOrThrow({ where: { id } });
    return this.prisma.terminal.delete({ where: { id } });
  }
}
