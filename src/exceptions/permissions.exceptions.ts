import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  roleAlreadyExist,
  roleNotFound,
  roleNotUpdated,
} from 'src/common/utils/constants';

export class RoleExistException extends ConflictException {
  constructor() {
    super(roleAlreadyExist);
  }
}
export class RoleNotFoundException extends NotFoundException {
  constructor() {
    super(roleNotFound);
  }
}
export class RoleNotUpdatedException extends NotFoundException {
  constructor() {
    super(roleNotUpdated);
  }
}
