import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;

  await app.listen(port);
  // .then(() => {
  //   console.log(`Сервер запущен на http://localhost:${port}`);
  // })
  // .catch((error) => {
  //   console.error('Ошибка при запуске сервера:', error);
  // });
}

bootstrap();
