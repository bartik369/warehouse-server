import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

export class DeviceNotFoundException extends NotFoundException {
  constructor() {
    super(`Устройство не найдено`);
  }
}

export class DeviceExistsException extends ConflictException {
  constructor() {
    super(`Устройство уже существует`);
  }
}

export class ModelNotFoundException extends NotFoundException {
  constructor() {
    super(`Модель не найдена`);
  }
}

export class ModelExistsException extends ConflictException {
  constructor() {
    super(`Модель уже существует`);
  }
}

export class TypeNotFoundException extends NotFoundException {
  constructor() {
    super(`Тип не найден`);
  }
}

export class TypeExistsException extends ConflictException {
  constructor() {
    super(`Тип уже существует`);
  }
}
export class ManufacturerNotFoundException extends NotFoundException {
  constructor() {
    super(`Производитель не найден`);
  }
}

export class ManufacturerExistsException extends ConflictException {
  constructor() {
    super(`Производитель уже существует`);
  }
}
