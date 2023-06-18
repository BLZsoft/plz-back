import { ApiProperty } from '@nestjs/swagger';
import { Object } from '@prisma/client';

export class ObjectEntity implements Object {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  sp2type: string;

  @ApiProperty()
  sp2name: string;

  @ApiProperty()
  sp2questions: string;

  @ApiProperty()
  upFloors: number;

  @ApiProperty()
  isUnderFloor: boolean;

  @ApiProperty()
  underFloors: number;

  @ApiProperty()
  fireRoomArea: number;

  @ApiProperty()
  tradeArea: number;

  @ApiProperty()
  blackTradeRooms: boolean;

  @ApiProperty()
  height: number;

  @ApiProperty()
  volume: number;

  @ApiProperty()
  class: string;

  @ApiProperty()
  degree: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  typeOfBuild: string;
}
