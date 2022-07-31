import { v4 } from 'uuid';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { CacheAPILogger } from '../../logger/logger.service';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private readonly cacheAPILogger: CacheAPILogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    request['id'] = v4();
    this.cacheAPILogger.log(`Received a request to ${request.path}`);
    return next.handle();
  }
}
