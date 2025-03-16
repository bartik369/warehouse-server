import { ConflictException, NotFoundException } from '@nestjs/common';

export class WarehouseExistException extends ConflictException {
  constructor() {
    super('Склад уже существует');
  }
}
export class CityExistException extends NotFoundException {
  constructor() {
    super('Города не существует');
  }
}
