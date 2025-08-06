import { Module } from '@nestjs/common';
import { GstsService } from './gsts.service';
import { GstsController } from './gsts.controller';
@Module({ controllers: [GstsController], providers: [GstsService] })
export class GstsModule {}