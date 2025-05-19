"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAccessToken = void 0;
const common_1 = require("@nestjs/common");
exports.GetAccessToken = (0, common_1.createParamDecorator)((_, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
});
//# sourceMappingURL=access-token.decorator.js.map