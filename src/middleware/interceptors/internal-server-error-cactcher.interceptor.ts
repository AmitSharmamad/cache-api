import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { CacheAPILogger } from '../../logger/logger.service';

@Injectable()
export class InternalServerErrorExceptionInterceptor
  implements NestInterceptor
{
  constructor(private readonly cacheAPILogger: CacheAPILogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => value),
      catchError((error) => {
        this.cacheAPILogger.log(
          `Error occurred while serving the api: ${error}, ${error.stack}`,
        );
        throw new InternalServerErrorException(error);
      }),
    );
  }
}
