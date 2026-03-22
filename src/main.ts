import { HttpException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const uploadDir = process.env.STORAGE_LOCAL_DIR ?? 'uploads';
  app.useStaticAssets(join(process.cwd(), uploadDir), {
    prefix: '/uploads/',
  });
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  });
  process.on('uncaughtException', (err) => logger.error('Uncaught Exception', err.stack));
  process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection', String(reason)));

  app.useGlobalFilters({
    catch(exception: unknown, host) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const status = exception instanceof HttpException ? exception.getStatus() : 500;
      if (status >= 500) {
        logger.error(exception instanceof Error ? exception.stack : String(exception));
      } else {
        logger.warn(exception instanceof HttpException ? JSON.stringify(exception.getResponse()) : String(exception));
      }
      if (exception instanceof HttpException) {
        response.status(status).json(exception.getResponse());
      } else {
        response.status(500).json({ statusCode: 500, message: 'Internal server error' });
      }
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
void bootstrap();
