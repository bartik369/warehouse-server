import { NotFoundException, ForbiddenException} from '@nestjs/common';

export class UserNotFoundExeption extends NotFoundException {
    constructor() {
        super('Пожалуйста, проверьте данные для входа!');
    }
}
export class DeniedAccessExeption extends ForbiddenException {
    constructor() {
        super('Отказано в доступе!');
    }
}