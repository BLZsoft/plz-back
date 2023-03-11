import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WithOwnerEntity {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  author?: boolean;
}

export class CoOwnerEntity {
  @ApiProperty()
  id: string;
}
