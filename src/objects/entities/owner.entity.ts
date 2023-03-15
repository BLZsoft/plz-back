import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OwnerEntity {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  author?: boolean;
}
