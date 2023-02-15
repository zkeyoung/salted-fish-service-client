import { registerAs } from '@nestjs/config';

export default registerAs('user', () => ({
  MESSAGE_SECRET: process.env.MESSAGE_SECRET,
}));
