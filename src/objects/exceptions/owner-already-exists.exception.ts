import { BadRequestException } from '@nestjs/common';

export class OwnerAlreadyExistsException extends BadRequestException {
  constructor() {
    super('OWNER_ALREADY_EXISTS');
  }
}
