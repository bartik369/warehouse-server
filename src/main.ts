import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  });
  app.setGlobalPrefix('api/');
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 5000);
  
}
bootstrap();