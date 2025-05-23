import { NotFoundException, ForbiddenException, UnauthorizedException, ConflictException } from '@nestjs/common';
export declare class UserNotFoundException extends NotFoundException {
    constructor();
}
export declare class DeniedAccessException extends ForbiddenException {
    constructor();
}
export declare class UnauthorizeException extends UnauthorizedException {
    constructor();
}
export declare class ConflictUserException extends ConflictException {
    constructor();
}
