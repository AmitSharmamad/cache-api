import { Module } from '@nestjs/common';
import { CacheAPILogger } from './logger.service';

@Module({
  providers: [CacheAPILogger],
  exports: [CacheAPILogger],
})
export class LoggerModule {}
