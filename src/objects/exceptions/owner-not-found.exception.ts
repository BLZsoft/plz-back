import { NotFoundException } from '@nestjs/common';

export class OwnerNotFoundException extends NotFoundException {
  constructor() {
    super('OWNER_NOT_FOUND');
  }
}
