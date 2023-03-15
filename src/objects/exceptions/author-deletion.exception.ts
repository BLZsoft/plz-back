import { BadRequestException } from '@nestjs/common';

export class AuthorDeletionException extends BadRequestException {
  constructor() {
    super('AUTHOR_CAN_NOT_BE_DELETED');
  }
}
