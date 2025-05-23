"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarrantyValidateException = exports.ContactorNotUpdatedException = exports.ContactorNotFoundException = exports.ContactorExistsException = exports.WrongFileType = exports.WrongFileSize = exports.ManufacturerExistsException = exports.ManufacturerNotFoundException = exports.TypeExistsException = exports.TypeNotFoundException = exports.ModelExistsException = exports.ModelNotFoundException = exports.DeviceExistsException = exports.DeviceNotFoundException = void 0;
const constants_1 = require("../common/utils/constants");
const common_1 = require("@nestjs/common");
const constants_2 = require("../common/utils/constants");
class DeviceNotFoundException extends common_1.NotFoundException {
    constructor() {
        super(constants_2.deviceNotFound);
    }
}
exports.DeviceNotFoundException = DeviceNotFoundException;
class DeviceExistsException extends common_1.ConflictException {
    constructor() {
        super(constants_2.deviceAlreadyExists);
    }
}
exports.DeviceExistsException = DeviceExistsException;
class ModelNotFoundException extends common_1.NotFoundException {
    constructor() {
        super(constants_2.modelNotFound);
    }
}
exports.ModelNotFoundException = ModelNotFoundException;
class ModelExistsException extends common_1.ConflictException {
    constructor() {
        super(constants_2.modelAlreadyExists);
    }
}
exports.ModelExistsException = ModelExistsException;
class TypeNotFoundException extends common_1.NotFoundException {
    constructor() {
        super(constants_2.typeNotFound);
    }
}
exports.TypeNotFoundException = TypeNotFoundException;
class TypeExistsException extends common_1.ConflictException {
    constructor() {
        super(constants_2.typeAlreadyExists);
    }
}
exports.TypeExistsException = TypeExistsException;
class ManufacturerNotFoundException extends common_1.NotFoundException {
    constructor() {
        super(constants_2.manufacturerNotFound);
    }
}
exports.ManufacturerNotFoundException = ManufacturerNotFoundException;
class ManufacturerExistsException extends common_1.ConflictException {
    constructor() {
        super(constants_2.manufacturerAlreadyExists);
    }
}
exports.ManufacturerExistsException = ManufacturerExistsException;
class WrongFileSize extends common_1.ConflictException {
    constructor() {
        super(constants_1.unacceptableDataSize);
    }
}
exports.WrongFileSize = WrongFileSize;
class WrongFileType extends common_1.ConflictException {
    constructor() {
        super(constants_1.unacceptableDataFormat);
    }
}
exports.WrongFileType = WrongFileType;
class ContactorExistsException extends common_1.ConflictException {
    constructor() {
        super(constants_2.contractorAlreadyExists);
    }
}
exports.ContactorExistsException = ContactorExistsException;
class ContactorNotFoundException extends common_1.NotFoundException {
    constructor() {
        super(constants_2.contractorNotFound);
    }
}
exports.ContactorNotFoundException = ContactorNotFoundException;
class ContactorNotUpdatedException extends common_1.NotFoundException {
    constructor() {
        super(constants_2.contractorNotFound);
    }
}
exports.ContactorNotUpdatedException = ContactorNotUpdatedException;
class WarrantyValidateException extends common_1.ConflictException {
    constructor() {
        super(constants_2.validateWarrantyInputs);
    }
}
exports.WarrantyValidateException = WarrantyValidateException;
//# sourceMappingURL=device.exceptions.js.map