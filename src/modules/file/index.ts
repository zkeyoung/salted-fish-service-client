import { Module } from '@nestjs/common';
import FilesController from './controller';
import FileService from './service';

@Module({
  controllers: [FilesController],
  providers: [FileService],
})
export default class FileModule {}
