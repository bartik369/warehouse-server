import {
  wrongAuthData,
  deniedAccess,
  unauthorized,
  userAlreadyExist,
} from 'src/common/utils/constants';
import {
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  ConflictException,
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
