import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { TableAreasService } from './table-areas.service';
import { CreateTableAreaDto } from './dto/create-table-area.dto';
import { UpdateTableAreaDto } from './dto/update-table-area.dto';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@Controller('table-areas')
export class TableAreasController {
  constructor(private readonly tableAreasService: TableAreasService) {}
  @Post() create(@Body() createDto: CreateTableAreaDto) { return this.tableAreasService.create(createDto); }
  @Get() findAll() { return this.tableAreasService.findAll(); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateTableAreaDto) { return this.tableAreasService.update(id, updateDto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.tableAreasService.remove(id); }
}