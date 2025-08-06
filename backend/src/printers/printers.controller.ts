import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { PrintersService } from './printers.service';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@Controller('printers')
export class PrintersController {
  constructor(private readonly printersService: PrintersService) {}
  @Post() create(@Body() createDto: CreatePrinterDto) { return this.printersService.create(createDto); }
  @Get() findAll() { return this.printersService.findAll(); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdatePrinterDto) { return this.printersService.update(id, updateDto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.printersService.remove(id); }
}