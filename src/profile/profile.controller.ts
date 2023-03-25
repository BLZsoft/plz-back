import { Body, Controller, Patch, UploadedFile } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Authorized, Token, TokenPayload } from 'auth';
import { ApiFile, fileMimetypeFilter } from 'common/file';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('Профиль')
@Controller('profile')
@Authorized()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch()
  @ApiFile('avatar', { fileFilter: fileMimetypeFilter('image') })
  @ApiOperation({
    summary: 'Обновляет профиль пользователя.'
  })
  @ApiOkResponse({
    description: 'Профиль успешно обновлён.'
  })
  create(
    @Token() token: TokenPayload,
    @Body() payload: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<void> {
    return this.profileService.update(token.sub, payload, file);
  }
}
