import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { Connection } from 'mongoose';
import { DatabaseModule } from '../database/database.module';
import { CacheAPISchema } from './cache-api.schema';
import { CACHE_API_MODEL } from './cache-api.constants';
import { CacheAPIController } from './cache-api.controller';
import { CacheAPIService } from './cache-api.service';
import { DATABASE_CONNECTION } from '../database/database.constants';
import { MiddlewareModule } from '../middleware/middleware.module';
import { LoggerModule } from '../logger/logger.module';
import { CacheAPILogger } from '../logger/logger.service';
import {
  CACHE_EXPIRY_TIME,
  CACHE_KEY_LIMIT,
  LOG_LEVEL,
  MONGO_DB_CONNECTION_URL,
  PAGE_SIZE,
  SECUTIRY_KEY,
  TURN_ON_SECURITY,
} from '../env';

@Module({
  imports: [MiddlewareModule, DatabaseModule, LoggerModule],
  controllers: [CacheAPIController],
  providers: [
    {
      provide: CACHE_API_MODEL,
      useFactory: (connection: Connection) =>
        connection.model('CacheAPI', CacheAPISchema, 'cache'),
      inject: [DATABASE_CONNECTION],
    },
    CacheAPIService,
  ],
})
export class CacheAPIModule implements OnApplicationBootstrap {
  constructor(private readonly cacheAPILogger: CacheAPILogger) {}

  async onApplicationBootstrap() {
    this.cacheAPILogger.log(
      `The Cache expiry time is set to ${CACHE_EXPIRY_TIME} second(s)`,
    );
    this.cacheAPILogger.log(
      `The Cache limit is set to ${CACHE_KEY_LIMIT} keys`,
    );
    this.cacheAPILogger.log(
      `The Mongo Connection URL is set to ${MONGO_DB_CONNECTION_URL}`,
    );
    this.cacheAPILogger.log(`The Security is set to ${TURN_ON_SECURITY}`);
    this.cacheAPILogger.log(`The Default Page Size is set to ${PAGE_SIZE}`);
    this.cacheAPILogger.log(`The Log Level is set to ${LOG_LEVEL}`);
  }
}
