import * as dotenv from 'dotenv';

dotenv.config();

import { NestFactory } from '@nestjs/core';
import { CacheAPIModule } from './cache-api/cache-api.module';
import { LOG_LEVEL } from './env';
import { LogLevel } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(CacheAPIModule, {
    logger: [LOG_LEVEL as LogLevel],
  });
  await app.listen(3000);
}

bootstrap();
