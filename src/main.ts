import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://cybercode.veney.tech',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;

  try {
    await app.listen(port);
    console.log(`Сервер запущен на http://localhost:${port}`);
  } catch (error: unknown) {
    console.error('Ошибка при запуске сервера:', error);
  }
}

bootstrap();
