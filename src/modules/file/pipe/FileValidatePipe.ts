import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export default class FileValidatePipe
  implements PipeTransform<Express.Multer.File, Express.Multer.File>
{
  private readonly maxFileSize: number = 1 * 1024 * 1024;
  private readonly fileTypes: string[] = [];

  constructor({
    maxFileSize,
    fileTypes,
  }: {
    maxFileSize?: number;
    fileTypes?: string[];
  }) {
    if (maxFileSize && maxFileSize > 0) this.maxFileSize = maxFileSize;
    if (fileTypes && fileTypes.length) this.fileTypes = fileTypes;
  }
  transform(file: Express.Multer.File) {
    if (file.size > this.maxFileSize) throw new BadRequestException();
    if (
      this.fileTypes.length &&
      !this.fileTypes.some((filetype) => file.mimetype.match(filetype))
    )
      throw new BadRequestException();
    return file;
  }
}
