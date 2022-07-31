import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CACHE_EXPIRY_TIME, CACHE_KEY_LIMIT } from '../env';
import { CacheAPILogger } from '../logger/logger.service';
import { CACHE_API_MODEL } from './cache-api.constants';
import { CreateCacheAPIRequestDto } from './cache-api.dto';
import { CacheAPI } from './cache-api.model';

@Injectable()
export class CacheAPIService {
  constructor(
    @Inject(CACHE_API_MODEL)
    private readonly cacheAPIModel: Model<CacheAPI>,
    private readonly cacheAPILogger: CacheAPILogger,
  ) {}

  /**
   * Cache keys are created and updated in a round-robin fashion as explained in the
   * below example
   * @example: If the cache limit is 3, there are 2 states
   * 1. When the no. of documents is less than 3, a document is created
   * 2. When the no. of documents in equal to 3,
   *    a. sort the documents by ascending order of updated date
   *    b. update the first document and return it
   */
  async createCacheByKey(
    key: string,
    cacheAPIRequestDto: CreateCacheAPIRequestDto,
  ): Promise<CacheAPI> {
    const existingCache = await this.cacheAPIModel.findOne({ key });

    // if cache exists
    if (existingCache) {
      existingCache.value = cacheAPIRequestDto.value;
      await this.updateByCacheKey(key, existingCache.toObject());
      const updatedCache = await this.cacheAPIModel.findOne({ key });
      this.resetCacheTTLByKey(key);
      return updatedCache;
    }

    // check if the cache limit is hit
    if ((await this.cacheAPIModel.count({})) === CACHE_KEY_LIMIT) {
      this.cacheAPILogger.log(
        `The Cache API reached its limits in no. of keys ${CACHE_KEY_LIMIT}`,
      );
      // sort the documents by updated date and update the cache
      const cache = (
        await this.cacheAPIModel.find().sort({ updatedAt: 1 })
      )?.[0];

      this.cacheAPILogger.log(`Cache with ${cache.key} will be updated`);

      const newCache = new CacheAPI();
      newCache.key = key;
      newCache.value = cacheAPIRequestDto.value;
      newCache.createdAt = cache.createdAt;

      await this.cacheAPIModel.updateOne({ key: cache.key }, newCache);
      this.resetCacheTTLByKey(key);
      return cache;
    } else {
      return (
        await this.cacheAPIModel.create({
          key,
          ...cacheAPIRequestDto,
        })
      )?.toObject();
    }
  }

  async updateByCacheKey(key: string, cache: Partial<CacheAPI>) {
    return this.cacheAPIModel.updateOne(
      {
        key,
      },
      { ...cache, expireAfterSeconds: CACHE_EXPIRY_TIME },
    );
  }

  async getCacheByKey(key: string): Promise<CacheAPI> {
    return (
      await this.cacheAPIModel.findOne({
        key,
      })
    )?.toObject();
  }

  async getAll(page: number, size: number) {
    return (
      await this.cacheAPIModel.find({}, {}, { skip: page * size, limit: size })
    )?.map((doc) => doc.toObject());
  }

  async removeCacheByKey(key: string) {
    return (await this.cacheAPIModel.findOneAndRemove({ key }))?.toObject();
  }

  async removeAll() {
    return this.cacheAPIModel.deleteMany({});
  }

  async resetCacheTTLByKey(key: string) {
    return this.cacheAPIModel.updateOne(
      {
        key,
      },
      {
        expireAfterSeconds: CACHE_EXPIRY_TIME,
      },
    );
  }
}
