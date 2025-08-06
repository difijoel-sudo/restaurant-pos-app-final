import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateInvoiceTemplateDto } from './dto/update-invoice-template.dto';
@Injectable()
export class InvoiceTemplatesService {
  constructor(private readonly prisma: PrismaService) {}
  
  // There is only one template, so we find it by its fixed ID of 1
  // If it doesn't exist, we create it with default values.
  async findOne() {
    const template = await this.prisma.invoiceTemplate.findUnique({ where: { id: 1 } });
    if (!template) {
        return this.prisma.invoiceTemplate.create({
            data: {
                id: 1,
                restaurantName: "My Restaurant"
            }
        })
    }
    return template;
  }

  async update(updateDto: UpdateInvoiceTemplateDto) {
    return this.prisma.invoiceTemplate.update({
        where: { id: 1 },
        data: updateDto
    });
  }
}