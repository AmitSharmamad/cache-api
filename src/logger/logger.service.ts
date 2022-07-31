import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class CacheAPILogger extends ConsoleLogger {}
