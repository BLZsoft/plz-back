import { ApiProperty } from '@nestjs/swagger';

export class PaginationResultDto<T> {
  @ApiProperty()
  readonly data: T[];

  @ApiProperty()
  readonly total: number;
}
