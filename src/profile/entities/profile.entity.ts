import { ApiProperty } from '@nestjs/swagger';

export class ProfileEntity {
  @ApiProperty()
  username: string;
  @ApiProperty()
  primaryEmail: string;
  @ApiProperty()
  primaryPhone: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: 'file' })
  avatar: any;
}
