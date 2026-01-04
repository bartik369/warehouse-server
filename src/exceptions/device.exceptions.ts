import {
  contractorAlreadyExists,
  contractorNotFound,
  deviceAlreadyExists,
  deviceNotFound,
  manufacturerAlreadyExists,
  manufacturerNotFound,
  modelAlreadyExists,
  modelNotFound,
  typeAlreadyExists,
  typeNotFound,
  unacceptableDataFormat,
  unacceptableDataSize,
  validateWarrantyInputs,
} from 'src/common/utils/constants';

import { ConflictException, NotFoundException } from '@nestjs/common';

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
    super(unacceptableDataSize);
  }
}
export class WrongFileType extends ConflictException {
  constructor() {
    super(unacceptableDataFormat);
  }
}
export class ContactorExistsException extends ConflictException {
  constructor() {
    super(contractorAlreadyExists);
  }
}
export class ContactorNotFoundException extends NotFoundException {
  constructor() {
    super(contractorNotFound);
  }
}
export class ContactorNotUpdatedException extends NotFoundException {
  constructor() {
    super(contractorNotFound);
  }
}
export class WarrantyValidateException extends ConflictException {
  constructor() {
    super(validateWarrantyInputs);
  }
}
