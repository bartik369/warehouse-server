import {
  warehouseAlreadyExist,
  departmentAlreadyExist,
  warehouseNotFound,
  locationNotFound,
  departmentNotFound,
} from './../common/utils/constants';
import { ConflictException, NotFoundException } from '@nestjs/common';

export class WarehouseExistException extends ConflictException {
  constructor() {
    super(warehouseAlreadyExist);
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
