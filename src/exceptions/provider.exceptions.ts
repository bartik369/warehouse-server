import { NotFoundException } from '@nestjs/common';

export class ProviderNotFoundException extends NotFoundException {
  constructor() {
    super('Подрядчик не найден');
  }
}
