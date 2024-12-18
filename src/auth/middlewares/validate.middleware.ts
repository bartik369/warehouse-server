// import { PrismaService } from './../../../prisma/prisma.service';
// import { JwtPayload } from 'src/types/user.types';
// import { Injectable, NestMiddleware } from "@nestjs/common";
// import { Request, Response, NextFunction } from "express";
// import { JwtService } from "@nestjs/jwt";
// import { UnauthorizedException } from "@nestjs/common";
// import { UsersService } from "src/users/users.service";

// @Injectable()
// export class ValidateAccessMIddleware implements NestMiddleware {
//     constructor(
//         private jwtService: JwtService,
//         private prisma: PrismaService,
//         ) {}

//     async use(req: Request, res: Response, next: NextFunction ) {   
//        const token = this.extractTokenFromHeader(req);
//        if (!token) throw new UnauthorizedException();
//        try {
//          const validate: JwtPayload = await this.jwtService.verifyAsync(token, {
//              secret: process.env.JWT_ACCESS_SECRET
//          });

//          if (!validate) throw new UnauthorizedException();
//          const user = await this.prisma.user.findUnique({
//              where: {
//                  id: validate.sub
//              }
//          });
//          return res.json(user);
//        } catch (error) {
//            console.log(error);
//        }
//         next()
//     }

//     private extractTokenFromHeader(request: Request): string | undefined {
//         const [type, token] = request.headers.authorization?.split(' ') ?? [];
//         return type === 'Bearer' ? token : undefined;
//     }
// }