import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BadRequestException, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../../common/enums/app';
import { ConfigVariables } from '../../config';
import Entites from './entities';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<ConfigVariables>) => {
        const mongo = configService.get('mongo', { infer: true });
        const app = configService.get('app', { infer: true });
        return {
          type: 'mongo',
          dbName: mongo.dbName,
          clientUrl: mongo.clientUrl,
          debug: app.env === Environment.DEVELOPMENT,
          entities: Entites,
          findOneOrFailHandler: () => new BadRequestException(),
          filters: {
            exist: {
              cond: { deletedAt: new Date(0) },
              default: true,
              entity: Entites.map((Entity) => Entity.name),
            },
          },
          allowGlobalContext: true,
        };
      },
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature(Entites),
  ],
  exports: [MikroOrmModule],
})
export default class OrmModule {}
