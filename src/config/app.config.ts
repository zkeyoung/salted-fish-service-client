import { registerAs } from '@nestjs/config';
import { Environment } from '../common/enums/app';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || Environment.DEVELOPMENT,
  port: Number.parseInt(process.env.APP_PORT, 10) || 3000,
}));
