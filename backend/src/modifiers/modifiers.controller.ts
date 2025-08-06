import { Controller, Post, Body, Delete, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { ModifiersService } from './modifiers.service';
import { CreateModifierDto } from './dto/create-modifier.dto';
import { UpdateModifierDto } from './dto/update-modifier.dto';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@Controller('modifiers')
export class ModifiersController {
  constructor(private readonly modifiersService: ModifiersService) {}
  @Post() create(@Body() createDto: CreateModifierDto) { return this.modifiersService.create(createDto); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateModifierDto) { return this.modifiersService.update(id, updateDto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.modifiersService.remove(id); }
}