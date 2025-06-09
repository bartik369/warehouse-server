import { userAlreadyExist, userNotFound } from 'src/common/utils/constants';
import { ConflictException, NotFoundException } from '@nestjs/common';

export class ConflictUserException extends ConflictException {
  constructor() {
    super(userAlreadyExist);
  }
}
export class NotFoundUserException extends NotFoundException {
  constructor() {
    super(userNotFound);
  }
}
