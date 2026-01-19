import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import { PaginationMetaDto } from './pagination-meta.dto';

export function PaginatedResponseDto<T>(itemDto: Type<T>) {
  class PaginatedDto {
    @ApiProperty({ type: [itemDto] })
    items: T[];

    @ApiProperty({ type: PaginationMetaDto })
    meta: PaginationMetaDto;
  }

  return PaginatedDto;
}
