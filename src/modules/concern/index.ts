import { Module } from '@nestjs/common';
import OrmModule from '../orm';
import ConcernControler from './controller';
import ConcernService from './service';

@Module({
  imports: [OrmModule],
  controllers: [ConcernControler],
  providers: [ConcernService],
})
export default class ConcernModule {}
