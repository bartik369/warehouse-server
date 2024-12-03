import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:5173',
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 5000);
  
}
bootstrap();