import { userAlreadyExist } from 'src/common/utils/constants';
import { ConflictException } from '@nestjs/common';

export class ConflictUserException extends ConflictException {
  constructor() {
    super(userAlreadyExist);
  }
}
