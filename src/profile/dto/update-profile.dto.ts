import { PartialType } from '@nestjs/swagger';

import { ProfileEntity } from '../entities/profile.entity';

export class UpdateProfileDto extends PartialType(ProfileEntity) {
  
}