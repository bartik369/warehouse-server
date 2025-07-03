import { NotFoundException, ConflictException } from '@nestjs/common';

export class IssueNotFoundException extends NotFoundException {
  constructor() {
    super('Выдача не найдена');
  }
}
export class IssueProcessNotFoundException extends NotFoundException {
  constructor() {
    super('Процесс не найден');
  }
}

export class ConflictIssueException extends ConflictException {
  constructor() {
    super('Выдача уже существует');
  }
}
export class ConflictIssueProcessException extends ConflictException {
  constructor() {
    super('Процесс уже существует');
  }
}
