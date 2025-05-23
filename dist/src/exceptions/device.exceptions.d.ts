import { NotFoundException, ConflictException } from '@nestjs/common';
export declare class DeviceNotFoundException extends NotFoundException {
    constructor();
}
export declare class DeviceExistsException extends ConflictException {
    constructor();
}
export declare class ModelNotFoundException extends NotFoundException {
    constructor();
}
export declare class ModelExistsException extends ConflictException {
    constructor();
}
export declare class TypeNotFoundException extends NotFoundException {
    constructor();
}
export declare class TypeExistsException extends ConflictException {
    constructor();
}
export declare class ManufacturerNotFoundException extends NotFoundException {
    constructor();
}
export declare class ManufacturerExistsException extends ConflictException {
    constructor();
}
export declare class WrongFileSize extends ConflictException {
    constructor();
}
export declare class WrongFileType extends ConflictException {
    constructor();
}
export declare class ContactorExistsException extends ConflictException {
    constructor();
}
export declare class ContactorNotFoundException extends NotFoundException {
    constructor();
}
export declare class ContactorNotUpdatedException extends NotFoundException {
    constructor();
}
export declare class WarrantyValidateException extends ConflictException {
    constructor();
}
