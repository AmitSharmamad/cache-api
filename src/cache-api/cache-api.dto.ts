import { Expose } from 'class-transformer';
import { CacheAPI } from './cache-api.model';

export class CreateCacheAPIRequestDto implements Partial<CacheAPI> {
  value: string;
}

export class UpdateCacheAPIRequestDto implements Partial<CacheAPI> {}

export class CacheAPIResponseDto extends CacheAPI {
  @Expose()
  key: string;
  @Expose()
  value: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
