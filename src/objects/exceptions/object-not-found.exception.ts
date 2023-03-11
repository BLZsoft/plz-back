import { NotFoundException } from '@nestjs/common';

export class ObjectNotFoundException extends NotFoundException {
  constructor() {
    super('OBJECT_NOT_FOUND');
  }
}
