import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { SECUTIRY_KEY, TURN_ON_SECURITY } from '../../env';

@Injectable()
export class CacheAPIGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (TURN_ON_SECURITY === 'true') {
      const request: Request = context.switchToHttp().getRequest();
      const { headers } = request;
      if (headers['secret'] !== SECUTIRY_KEY) {
        throw new UnauthorizedException();
      }
      return true;
    } else {
      return true;
    }
  }
}
