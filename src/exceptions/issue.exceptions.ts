import { ConflictException, NotFoundException } from '@nestjs/common';

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
export class IssueFileNotFoundException extends NotFoundException {
  constructor() {
    super('Файл не найден');
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
export class ConflictIssueStatusException extends ConflictException {
  constructor() {
    super('Процесс завершен и удалению не подлежит');
  }
}
