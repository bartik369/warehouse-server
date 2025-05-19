import { ConflictException, NotFoundException } from '@nestjs/common';
export declare class WarehouseExistException extends ConflictException {
    constructor();
}
export declare class LocationExistException extends ConflictException {
    constructor();
}
export declare class WarehouseNotFoundException extends NotFoundException {
    constructor();
}
export declare class DepartmentExistException extends ConflictException {
    constructor();
}
export declare class LocationNotFoundException extends NotFoundException {
    constructor();
}
export declare class DepartmentNotFoundException extends NotFoundException {
    constructor();
}
