import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { KitchensService } from './kitchens.service';
import { CreateKitchenDto } from './dto/create-kitchen.dto';
import { UpdateKitchenDto } from './dto/update-kitchen.dto';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@Controller('kitchens')
export class KitchensController {
  constructor(private readonly kitchensService: KitchensService) {}
  @Post() create(@Body() createKitchenDto: CreateKitchenDto) { return this.kitchensService.create(createKitchenDto); }
  @Get() findAll() { return this.kitchensService.findAll(); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() updateKitchenDto: UpdateKitchenDto) { return this.kitchensService.update(id, updateKitchenDto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.kitchensService.remove(id); }
}
