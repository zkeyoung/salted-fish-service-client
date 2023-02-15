import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigVariables } from './config';
import { Logger } from 'nestjs-pino';
import { Environment } from './common/enums/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app
    .get(ConfigService<ConfigVariables>)
    .get('app', { infer: true });
  const logger = app.get<Logger>(Logger);
  app.useLogger(logger);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'client/v',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: appConfig.env === Environment.PRODUCTION,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(appConfig.port, () => {
    logger.log(appConfig, 'Bootstrap');
  });
}
bootstrap();
