import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sécurité headers
  app.use(helmet());
  const cookieMiddleware = typeof cookieParser === 'function' ? cookieParser : (cookieParser as any).default;
  app.use(cookieMiddleware());

  // Validation globale des DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Préfixe de versionnage d'API
  app.setGlobalPrefix('api/v1');

  // CORS sécurisé
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // Documentation Swagger OpenAPI 3
  const config = new DocumentBuilder()
    .setTitle('CodeQuest API')
    .setDescription('Plateforme de défis informatiques — API REST & WebSocket')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`[CodeQuest API] running on: http://localhost:${port}/api/v1`);
  console.log(`[CodeQuest Swagger] running on: http://localhost:${port}/api/docs`);
}

bootstrap();
