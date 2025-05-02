import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  permissionAlreadyExist,
  permissionNotFound,
  permissionNotUpdated,
  roleAlreadyExist,
  roleNotFound,
  roleNotUpdated,
  rolePermissionAlreadyExist,
  rolePermissionNotFound,
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
export class PermissionExistException extends ConflictException {
  constructor() {
    super(permissionAlreadyExist);
  }
}
export class PermissionNotFoundException extends NotFoundException {
  constructor() {
    super(permissionNotFound);
  }
}
export class RolePermissionExistException extends ConflictException {
  constructor() {
    super(rolePermissionAlreadyExist);
  }
}
export class RolePermissionNotFoundException extends NotFoundException {
  constructor() {
    super(rolePermissionNotFound);
  }
}
export class PermissionNotUpdatedException extends NotFoundException {
  constructor() {
    super(permissionNotUpdated);
  }
}
