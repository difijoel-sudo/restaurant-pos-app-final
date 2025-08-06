import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { ModifierGroupsService } from './modifier-groups.service';
import { CreateModifierGroupDto } from './dto/create-modifier-group.dto';
import { UpdateModifierGroupDto } from './dto/update-modifier-group.dto';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@Controller('modifier-groups')
export class ModifierGroupsController {
  constructor(private readonly modifierGroupsService: ModifierGroupsService) {}
  @Post() create(@Body() createDto: CreateModifierGroupDto) { return this.modifierGroupsService.create(createDto); }
  @Get() findAll() { return this.modifierGroupsService.findAll(); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateModifierGroupDto) { return this.modifierGroupsService.update(id, updateDto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.modifierGroupsService.remove(id); }
}