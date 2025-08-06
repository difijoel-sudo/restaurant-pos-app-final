import { Module } from '@nestjs/common';
import { InvoiceTemplatesService } from './invoice-templates.service';
import { InvoiceTemplatesController } from './invoice-templates.controller';
@Module({
  controllers: [InvoiceTemplatesController],
  providers: [InvoiceTemplatesService],
})
export class InvoiceTemplatesModule {}