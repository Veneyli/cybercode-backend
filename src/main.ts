import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://cybercode.veney.tech'],
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;

  try {
    await app.listen(port);
    console.log(
      `Сервер запущен на ${process.env.API_URL || 'http://localhost'}:${port}`,
    );
  } catch (error: unknown) {
    console.error('Ошибка при запуске сервера:', error);
  }
}

bootstrap();
