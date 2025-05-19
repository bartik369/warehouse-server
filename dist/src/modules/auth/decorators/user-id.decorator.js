"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserId = void 0;
const common_1 = require("@nestjs/common");
exports.GetUserId = (0, common_1.createParamDecorator)(async (_, context) => {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    return userId;
});
//# sourceMappingURL=user-id.decorator.js.map