import { BadRequestException } from '@nestjs/common';

export class AuthorDeletionException extends BadRequestException {
  constructor() {
    super('CAN_NOT_DELETE_AUTHOR');
  }
}
