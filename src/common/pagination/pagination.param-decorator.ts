import { PipeTransform, Query } from '@nestjs/common';

import {
  DEFAULT_SKIP,
  DEFAULT_TAKE,
  PaginationDto,
  RawPaginationDto
} from './pagination.dto';

class PaginationPipe implements PipeTransform<RawPaginationDto, PaginationDto> {
  transform(value: RawPaginationDto): PaginationDto {
    return {
      skip: parseInt(value.skip?.toString(), 10) || DEFAULT_SKIP,
      take: parseInt(value.take?.toString(), 10) || DEFAULT_TAKE
    };
  }
}

export const Pagination = (): ParameterDecorator => Query(new PaginationPipe());
