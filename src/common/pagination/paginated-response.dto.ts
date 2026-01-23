import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import { PaginationMetaDto } from './pagination-meta.dto';

export function PaginatedResponseDto<T>(itemDto: Type<T>) {
  @ApiExtraModels(itemDto, PaginationMetaDto)
  class PaginatedDto {
    @ApiProperty({ type: [itemDto] })
    items: T[];

    @ApiProperty({ type: PaginationMetaDto })
    meta: PaginationMetaDto;
  }

  Object.defineProperty(PaginatedDto, 'name', {
    value: `Paginated${itemDto.name}`,
  });

  return PaginatedDto;
}
