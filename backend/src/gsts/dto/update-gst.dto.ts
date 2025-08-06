import { PartialType } from '@nestjs/mapped-types';
import { CreateGstDto } from './create-gst.dto';

export class UpdateGstDto extends PartialType(CreateGstDto) {}