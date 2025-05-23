"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionNotUpdatedException = exports.RolePermissionNotFoundException = exports.RolePermissionExistException = exports.PermissionNotFoundException = exports.PermissionExistException = exports.RoleNotUpdatedException = exports.RoleNotFoundException = exports.RoleExistException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../common/utils/constants");
class RoleExistException extends common_1.ConflictException {
    constructor() {
        super(constants_1.roleAlreadyExist);
    }
}
exports.RoleExistException = RoleExistException;
class RoleNotFoundException extends common_1.NotFoundException {
    constructor() {
        super(constants_1.roleNotFound);
    }
}
exports.RoleNotFoundException = RoleNotFoundException;
class RoleNotUpdatedException extends common_1.NotFoundException {
    constructor() {
        super(constants_1.roleNotUpdated);
    }
}
exports.RoleNotUpdatedException = RoleNotUpdatedException;
class PermissionExistException extends common_1.ConflictException {
    constructor() {
        super(constants_1.permissionAlreadyExist);
    }
}
exports.PermissionExistException = PermissionExistException;
class PermissionNotFoundException extends common_1.NotFoundException {
    constructor() {
        super(constants_1.permissionNotFound);
    }
}
exports.PermissionNotFoundException = PermissionNotFoundException;
class RolePermissionExistException extends common_1.ConflictException {
    constructor() {
        super(constants_1.rolePermissionAlreadyExist);
    }
}
exports.RolePermissionExistException = RolePermissionExistException;
class RolePermissionNotFoundException extends common_1.NotFoundException {
    constructor() {
        super(constants_1.rolePermissionNotFound);
    }
}
exports.RolePermissionNotFoundException = RolePermissionNotFoundException;
class PermissionNotUpdatedException extends common_1.NotFoundException {
    constructor() {
        super(constants_1.permissionNotUpdated);
    }
}
exports.PermissionNotUpdatedException = PermissionNotUpdatedException;
//# sourceMappingURL=permissions.exceptions.js.map