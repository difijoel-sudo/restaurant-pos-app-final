import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { GstsService } from './gsts.service';
import { CreateGstDto } from './dto/create-gst.dto';
import { UpdateGstDto } from './dto/update-gst.dto';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@Controller('gsts')
export class GstsController {
  constructor(private readonly gstsService: GstsService) {}
  @Post() create(@Body() createGstDto: CreateGstDto) { return this.gstsService.create(createGstDto); }
  @Get() findAll() { return this.gstsService.findAll(); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() updateGstDto: UpdateGstDto) { return this.gstsService.update(id, updateGstDto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.gstsService.remove(id); }
}