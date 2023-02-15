import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';
import util from 'node:util';
const pbkdf2 = util.promisify(crypto.pbkdf2);

@Injectable()
export default class CryptoService {
  genSalt(len = 6) {
    return crypto.randomBytes(len).toString('base64');
  }

  async hashPwd(password: string, salt: string) {
    const hashBuffer = await pbkdf2(password, salt, 1000000, 64, 'sha512');
    return hashBuffer.toString('hex');
  }

  aesEncode(plain: Buffer, secret: string): Buffer {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(secret),
      Buffer.alloc(16),
    );
    return Buffer.concat([cipher.update(plain), cipher.final()]);
  }

  aesDecode(encrypt: Buffer, secret: string): Buffer {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(secret),
      Buffer.alloc(16),
    );
    return Buffer.concat([decipher.update(encrypt), decipher.final()]);
  }

  aesEncodeString(plain: string, secret: string): string {
    return this.aesEncode(Buffer.from(plain), secret).toString('hex');
  }

  aesDecodeString(encrypt: string, secret: string): string {
    return this.aesDecode(Buffer.from(encrypt, 'hex'), secret).toString();
  }
}
