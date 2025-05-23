"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictUserException = exports.UnauthorizeException = exports.DeniedAccessException = exports.UserNotFoundException = void 0;
const constants_1 = require("../common/utils/constants");
const common_1 = require("@nestjs/common");
class UserNotFoundException extends common_1.NotFoundException {
    constructor() {
        super(constants_1.wrongAuthData);
    }
}
exports.UserNotFoundException = UserNotFoundException;
class DeniedAccessException extends common_1.ForbiddenException {
    constructor() {
        super(constants_1.deniedAccess);
    }
}
exports.DeniedAccessException = DeniedAccessException;
class UnauthorizeException extends common_1.UnauthorizedException {
    constructor() {
        super(constants_1.unauthorized);
    }
}
exports.UnauthorizeException = UnauthorizeException;
class ConflictUserException extends common_1.ConflictException {
    constructor() {
        super(constants_1.userAlreadyExist);
    }
}
exports.ConflictUserException = ConflictUserException;
//# sourceMappingURL=auth.exceptions.js.map