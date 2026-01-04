import {
  deniedAccess,
  unauthorized,
  userAlreadyExist,
  wrongAuthData,
} from 'src/common/utils/constants';

import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(wrongAuthData);
  }
}
export class DeniedAccessException extends ForbiddenException {
  constructor() {
    super(deniedAccess);
  }
}
export class UnauthorizeException extends UnauthorizedException {
  constructor() {
    super(unauthorized);
  }
}
export class ConflictUserException extends ConflictException {
  constructor() {
    super(userAlreadyExist);
  }
}
