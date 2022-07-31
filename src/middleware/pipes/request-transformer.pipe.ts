import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RequestTransformerPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    return plainToInstance(metatype, value);
  }
}
