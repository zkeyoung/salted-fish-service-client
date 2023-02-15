import { registerAs } from '@nestjs/config';

export default registerAs('ttl', () => ({
  GET_SVG_CAPTCHA: Number.parseInt(process.env.TTL_GET_SVG_CAPTCHA, 10),
}));
