import { Injectable, StreamableFile } from '@nestjs/common';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import fsPro from 'node:fs/promises';

@Injectable()
export default class FileService {
  private readonly uploadPath = path.resolve(__dirname, '../../../uploads');

  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath);
    }
  }

  async uploadOneFile(file: Express.Multer.File) {
    const fileId = `${crypto.randomUUID().replaceAll('-', '')}`;
    await fsPro.writeFile(path.join(this.uploadPath, fileId), file.buffer);
    return fileId;
  }

  async getOneOriginFile(fileId: string): Promise<StreamableFile> {
    const filePath = path.join(this.uploadPath, fileId);
    const createStream = fs.createReadStream(filePath);
    return new StreamableFile(createStream);
  }
}
