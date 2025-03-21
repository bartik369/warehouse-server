import {
  wrongAuthData,
  deniedAccess,
  unauthorized,
} from 'src/common/utils/constants';
import {
  NotFoundException,
  ForbiddenException,
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
