import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import SwaggerSetup from './utils/setup/swagger';
import helmet from 'helmet';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  const configService = app.get<ConfigService>(ConfigService);
  // helmet
  app.use(helmet());
  app.use(compression());
  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'swagger', method: RequestMethod.GET }],
  });
  // expose storage static files

  SwaggerSetup(app);

  app.useGlobalPipes(new ValidationPipe(
    {
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 422,
    }
  ));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
