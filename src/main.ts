import express from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", "http://localhost:5000"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  helmet.noSniff();
  helmet.frameguard({ action: 'deny' });
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests from this IP, please try again later',
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.enableCors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    // allowedHeaders: "Content-Type, Authorization",
  });
  
  app.use('/uploads', express.static(__dirname + '/uploads'));
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

