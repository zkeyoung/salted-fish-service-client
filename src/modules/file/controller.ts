import {
  Controller,
  Get,
  Header,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import GetFileDto from './dto/get-file';
import FileValidatePipe from './pipe/FileValidatePipe';
import FileService from './service';

@Controller('files')
export default class FilesController {
  constructor(private readonly fileService: FileService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  postFileUpload(
    @UploadedFile(
      new FileValidatePipe({
        maxFileSize: 3 * 1024 * 1024,
        fileTypes: ['jpeg', 'png'],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileService.uploadOneFile(file);
  }

  @Get(':fileId')
  @Header('Content-Type', 'image/jpeg')
  async getFilePreview(@Param() { fileId }: GetFileDto) {
    return this.fileService.getOneOriginFile(fileId);
  }
}
