import {
  warehouseAlreadyExist,
  departmentAlreadyExist,
  warehouseNotFound,
  locationNotFound,
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
