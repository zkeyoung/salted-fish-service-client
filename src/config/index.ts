import { ConfigType } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { Environment } from '../common/enums/app';
import appConfig from './app.config';
import mongoConfig from './mongo.config';
import redisConfig from './redis.config';
import tokenConfig from './token.config';
import ttlConfig from './ttl.config';
import userConfig from './user.config';

export const ConfigLoadList = [
  appConfig,
  mongoConfig,
  redisConfig,
  ttlConfig,
  tokenConfig,
  userConfig,
];

export class ConfigVariables {
  app: ConfigType<typeof appConfig>;
  mongo: ConfigType<typeof mongoConfig>;
  redis: ConfigType<typeof redisConfig>;
  ttl: ConfigType<typeof ttlConfig>;
  token: ConfigType<typeof tokenConfig>;
  user: ConfigType<typeof userConfig>;
}

export function ConfigValidate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;
  @IsNumber()
  APP_PORT: number;

  @IsString()
  TOKEN_SECRET: string;
  @IsString()
  TOKEN_PAYLOAD_SECRET: string;
  @IsString()
  TOKEN_EXPIRE: string;
  @IsString()
  REFRESH_TOKEN_SECRET: string;
  @IsNumber()
  REFRESH_TOKEN_EXPIRE: number;

  @IsString()
  @IsOptional()
  MONGO_ClIENT_URL: string;
  @IsString()
  MONGO_DB_NAME: string;

  @IsString()
  @IsOptional()
  REDIS_HOST: string;
  @IsNumber()
  @IsOptional()
  REDIS_PORT: number;

  @IsNumber()
  TTL_GET_SVG_CAPTCHA: number;

  @IsString()
  MESSAGE_SECRET: string;
}
