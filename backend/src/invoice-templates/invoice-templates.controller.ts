import { Controller, Get, Body, Patch, UseGuards, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoiceTemplatesService } from './invoice-templates.service';
import { UpdateInvoiceTemplateDto } from './dto/update-invoice-template.dto';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(AuthGuard('jwt'))
@Controller('invoice-templates')
export class InvoiceTemplatesController {
  constructor(private readonly invoiceTemplatesService: InvoiceTemplatesService) {}
  
  @Get() findOne() { return this.invoiceTemplatesService.findOne(); }
  
  @Patch() update(@Body() updateDto: UpdateInvoiceTemplateDto) { return this.invoiceTemplatesService.update(updateDto); }

  // --- THIS IS THE NEW ENDPOINT FOR UPLOADING THE LOGO ---
  @Post('upload-logo')
  @UseInterceptors(FileInterceptor('logo', { // 'logo' is the field name
      storage: diskStorage({
          destination: './public/uploads', // Save files to this folder
          filename: (req, file, cb) => {
              // Generate a unique filename
              const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
              return cb(null, `${randomName}${extname(file.originalname)}`);
          },
      }),
  }))
  uploadLogo(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
          throw new BadRequestException('No file uploaded.');
      }
      // Return the path to the saved file
      return { filePath: `/public/uploads/${file.filename}` };
  }
}