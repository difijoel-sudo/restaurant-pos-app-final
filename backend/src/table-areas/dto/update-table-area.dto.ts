import { PartialType } from '@nestjs/mapped-types';
import { CreateTableAreaDto } from './create-table-area.dto';
export class UpdateTableAreaDto extends PartialType(CreateTableAreaDto) {}