import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  clientUrl: process.env.MONGO_ClIENT_URL,
  dbName: process.env.MONGO_DB_NAME,
}));
