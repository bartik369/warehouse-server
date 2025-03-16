import { NotFoundException, ConflictException } from '@nestjs/common';
import {
  deviceAlreadyExists,
  manufacturerAlreadyExists,
  modelAlreadyExists,
  typeAlreadyExists,
  deviceNotFound,
  manufacturerNotFound,
  modelNotFound,
  typeNotFound,
  contractorAlreadyExists,
  validateWarrantyInputs,
} from 'src/common/utils/constants';

export class DeviceNotFoundException extends NotFoundException {
  constructor() {
    super(deviceNotFound);
  }
}

export class DeviceExistsException extends ConflictException {
  constructor() {
    super(deviceAlreadyExists);
  }
}

export class ModelNotFoundException extends NotFoundException {
  constructor() {
    super(modelNotFound);
  }
}

export class ModelExistsException extends ConflictException {
  constructor() {
    super(modelAlreadyExists);
  }
}

export class TypeNotFoundException extends NotFoundException {
  constructor() {
    super(typeNotFound);
  }
}

export class TypeExistsException extends ConflictException {
  constructor() {
    super(typeAlreadyExists);
  }
}
export class ManufacturerNotFoundException extends NotFoundException {
  constructor() {
    super(manufacturerNotFound);
  }
}

export class ManufacturerExistsException extends ConflictException {
  constructor() {
    super(manufacturerAlreadyExists);
  }
}

export class WrongFileSize extends ConflictException {
  constructor() {
    super(`Недопустимый размер файла! (Max 2mb)`);
  }
}
export class WrongFileType extends ConflictException {
  constructor() {
    super(`Недопустимый формат файла! Разрешены: jpg, png, jpeg`);
  }
}
export class ContactorExistsException extends ConflictException {
  constructor() {
    super(contractorAlreadyExists);
  }
}
export class WarrantyValidateException extends ConflictException {
  constructor() {
    super(validateWarrantyInputs);
  }
}
