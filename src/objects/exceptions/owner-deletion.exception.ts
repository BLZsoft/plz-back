import { BadRequestException } from '@nestjs/common';

export class OwnerDeletionException extends BadRequestException {
  constructor() {
    super('CAN_NOT_DELETE_OWNER');
  }
}
