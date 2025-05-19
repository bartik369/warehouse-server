import { ConflictException, NotFoundException } from '@nestjs/common';
export declare class RoleExistException extends ConflictException {
    constructor();
}
export declare class RoleNotFoundException extends NotFoundException {
    constructor();
}
export declare class RoleNotUpdatedException extends NotFoundException {
    constructor();
}
export declare class PermissionExistException extends ConflictException {
    constructor();
}
export declare class PermissionNotFoundException extends NotFoundException {
    constructor();
}
export declare class RolePermissionExistException extends ConflictException {
    constructor();
}
export declare class RolePermissionNotFoundException extends NotFoundException {
    constructor();
}
export declare class PermissionNotUpdatedException extends NotFoundException {
    constructor();
}
