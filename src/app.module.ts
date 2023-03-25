import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigValidate, ConfigLoadList, ConfigVariables } from './config';
import AuthModule from './modules/auth';
import UserModule from './modules/user';
import redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { LoggerModule } from 'nestjs-pino';
import LoggerMiddleware from './middleware/logger.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import CatchUnhandleException from './filter/exception.filter';
import FileModule from './modules/file';
import GoodModule from './modules/good';
import SessionModule from './modules/session';
import MessageModule from './modules/message';
import JwtAuthGuard from './guard/jwt-auth';
import GatewayModule from './modules/gateway';
import ConcernModule from './modules/concern';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions['socket']>({
      isGlobal: true,
      useFactory: (configService: ConfigService<ConfigVariables>) => {
        const redisConfig = configService.get('redis', { infer: true });
        return {
          store: redisStore,
          host: redisConfig.host,
          port: redisConfig.port,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: ConfigLoadList,
      validate: ConfigValidate,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        formatters: {
          level(label, number) {
            return { [label]: number };
          },
          log(obj: { consume? }) {
            if (obj.consume) obj.consume = Date.now() - obj.consume + 'ms';
            return obj;
          },
          bindings() {
            return {};
          },
        },
        timestamp: () => `,"time":${new Date().toISOString()}`,
        autoLogging: false,
        quietReqLogger: true,
      },
    }),
    FileModule,
    GoodModule,
    SessionModule,
    MessageModule,
    GatewayModule,
    ConcernModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CatchUnhandleException,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
