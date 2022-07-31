import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as morgan from 'morgan';
import { LoggerModule } from '../logger/logger.module';
import { CacheAPIGuard } from './guards/cache-api.guard';
import { InternalServerErrorExceptionInterceptor } from './interceptors/internal-server-error-cactcher.interceptor';
import { RequestTransformerPipe } from './pipes/request-transformer.pipe';

@Module({
  imports: [LoggerModule],
  providers: [
    CacheAPIGuard,
    RequestTransformerPipe,
    InternalServerErrorExceptionInterceptor,
  ],
  exports: [
    CacheAPIGuard,
    RequestTransformerPipe,
    InternalServerErrorExceptionInterceptor,
  ],
})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // configure morgan for api response logs
    consumer.apply(morgan('dev')).forRoutes('**');
  }
}
