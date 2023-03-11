import { ApiPropertyOptional } from '@nestjs/swagger';

export const DEFAULT_SKIP = 0;

export const DEFAULT_TAKE = 20;

export type RawPaginationDto = { skip?: string; take?: string };

export class PaginationDto {
  @ApiPropertyOptional({ default: DEFAULT_SKIP })
  readonly skip: number;

  @ApiPropertyOptional({ default: DEFAULT_TAKE })
  readonly take: number;
}
