import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { TerminalsService } from './terminals.service';
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@Controller('terminals')
export class TerminalsController {
  constructor(private readonly terminalsService: TerminalsService) {}
  @Post() create(@Body() createDto: CreateTerminalDto) { return this.terminalsService.create(createDto); }
  @Get() findAll() { return this.terminalsService.findAll(); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateTerminalDto) { return this.terminalsService.update(id, updateDto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.terminalsService.remove(id); }
}
