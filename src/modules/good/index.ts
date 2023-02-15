import { Module } from '@nestjs/common';
import OrmModule from '../orm';
import GoodsController from './controller';
import GoodService from './service';

@Module({
  imports: [OrmModule],
  controllers: [GoodsController],
  providers: [GoodService],
})
export default class GoodModule {}
