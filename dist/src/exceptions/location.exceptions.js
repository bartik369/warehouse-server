"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentNotFoundException = exports.LocationNotFoundException = exports.DepartmentExistException = exports.WarehouseNotFoundException = exports.LocationExistException = exports.WarehouseExistException = void 0;
const constants_1 = require("./../common/utils/constants");
const common_1 = require("@nestjs/common");
class WarehouseExistException extends common_1.ConflictException {
    constructor() {
        super(constants_1.warehouseAlreadyExist);
    }
}
exports.WarehouseExistException = WarehouseExistException;
class LocationExistException extends common_1.ConflictException {
    constructor() {
        super(constants_1.locationAlreadyExist);
    }
}
exports.LocationExistException = LocationExistException;
class WarehouseNotFoundException extends common_1.NotFoundException {
    constructor() {
        super(constants_1.warehouseNotFound);
    }
}
exports.WarehouseNotFoundException = WarehouseNotFoundException;
class DepartmentExistException extends common_1.ConflictException {
    constructor() {
        super(constants_1.departmentAlreadyExist);
    }
}
exports.DepartmentExistException = DepartmentExistException;
class LocationNotFoundException extends common_1.NotFoundException {
    constructor() {
        super(constants_1.locationNotFound);
    }
}
exports.LocationNotFoundException = LocationNotFoundException;
class DepartmentNotFoundException extends common_1.NotFoundException {
    constructor() {
        super(constants_1.departmentNotFound);
    }
}
exports.DepartmentNotFoundException = DepartmentNotFoundException;
//# sourceMappingURL=location.exceptions.js.map