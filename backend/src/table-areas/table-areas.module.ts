import { Module } from '@nestjs/common';
import { TableAreasService } from './table-areas.service';
import { TableAreasController } from './table-areas.controller';
@Module({
  controllers: [TableAreasController],
  providers: [TableAreasService],
})
export class TableAreasModule {}