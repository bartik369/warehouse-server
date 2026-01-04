import { ConflictException, NotFoundException } from '@nestjs/common';

import {
  departmentAlreadyExist,
  departmentNotFound,
  locationAlreadyExist,
  locationNotFound,
  warehouseAlreadyExist,
  warehouseNotFound,
} from './../common/utils/constants';

export class WarehouseExistException extends ConflictException {
  constructor() {
    super(warehouseAlreadyExist);
  }
}

export class LocationExistException extends ConflictException {
  constructor() {
    super(locationAlreadyExist);
  }
}
export class WarehouseNotFoundException extends NotFoundException {
  constructor() {
    super(warehouseNotFound);
  }
}
export class DepartmentExistException extends ConflictException {
  constructor() {
    super(departmentAlreadyExist);
  }
}
export class LocationNotFoundException extends NotFoundException {
  constructor() {
    super(locationNotFound);
  }
}
export class DepartmentNotFoundException extends NotFoundException {
  constructor() {
    super(departmentNotFound);
  }
}
