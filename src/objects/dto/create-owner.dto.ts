import { ApiProperty } from '@nestjs/swagger';

export class CreateOwnerDto {
  @ApiProperty()
  id: string;
}
