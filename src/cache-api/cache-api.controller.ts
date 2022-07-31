import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { v4 } from 'uuid';
import { CacheAPILogger } from '../logger/logger.service';
import { CacheAPIService } from './cache-api.service';
import { CreateCacheAPIRequestDto } from './cache-api.dto';
import { RequestTransformerPipe } from '../middleware/pipes/request-transformer.pipe';
import { CacheAPI } from './cache-api.model';
import { CacheAPIGuard } from '../middleware/guards/cache-api.guard';
import { InternalServerErrorExceptionInterceptor } from '../middleware/interceptors/internal-server-error-cactcher.interceptor';
import { RequestInterceptor } from '../middleware/interceptors/request.interceptor';
import { ResponseInterceptor } from '../middleware/interceptors/response.interceptor';
import { PAGE_SIZE } from '../env';

@Controller('/cache-api')
@UseInterceptors(
  ResponseInterceptor,
  RequestInterceptor,
  InternalServerErrorExceptionInterceptor,
)
@UseGuards(CacheAPIGuard)
export class CacheAPIController {
  constructor(
    private readonly cacheAPIService: CacheAPIService,
    private readonly cacheAPILogger: CacheAPILogger,
  ) {}

  /**
   * Add an endpoint that creates/updates the data for a given key.
   * @param key
   * @param cacheAPIRequestDto
   */
  @Post('keys/:key')
  async createCacheForAKey(
    @Param('key') key: string,
    @Body(RequestTransformerPipe) cacheAPIRequestDto: CreateCacheAPIRequestDto,
  ) {
    const { value } = cacheAPIRequestDto;
    if (!value) {
      throw new BadRequestException('Please enter a valid value');
    }
    return this.cacheAPIService.createCacheByKey(key, cacheAPIRequestDto);
  }

  @Patch('keys/:key')
  @HttpCode(HttpStatus.OK)
  async updateCacheByKey(
    @Param('key') key: string,
    @Body(RequestTransformerPipe) cacheAPIRequestDto: CreateCacheAPIRequestDto,
  ) {
    if (!key) {
      throw new BadRequestException('Key should not be empty');
    }
    const { value } = cacheAPIRequestDto;
    if (!value) {
      throw new BadRequestException('Please enter a valid value');
    }
    const cache = await this.cacheAPIService.getCacheByKey(key);
    if (!cache) {
      throw new BadRequestException('Please provide a valid key to update');
    }
    await this.cacheAPIService.updateByCacheKey(key, cacheAPIRequestDto);
    /**
     * The TTL will be reset on every read/cache hit.
     */
    this.cacheAPIService.resetCacheTTLByKey(key);
    return this.cacheAPIService.getCacheByKey(key);
  }

  /**
   * Add an endpoint that returns the cached data for a given key.
   * @param key
   * @returns
   */
  @Get('keys/:key')
  async getCacheByKey(@Param('key') key: string): Promise<CacheAPI> {
    if (!key) {
      throw new BadRequestException('Key should not be empty');
    }
    const cache = await this.cacheAPIService.getCacheByKey(key);
    if (!cache) {
      this.cacheAPILogger.log('Cache Miss');
      // create a random string
      const randomValue = v4();
      // update the cache with the random string
      return this.cacheAPIService.createCacheByKey(key, { value: randomValue });
    } else {
      this.cacheAPILogger.log('Cache Hit');
      return cache;
    }
  }

  /**
   * Add an endpoint that returns all stored keys in the cache.
   */
  @Get('keys')
  async getAllKeys(@Query('page') page: number, @Query('size') size: number) {
    /**
     * Not resetting the cache TTL because there is no specific cache hit
     */
    page = page - 1 || 0; // 1 based pages makes sense from the API's query stand point
    size = size || PAGE_SIZE;
    return {
      page,
      size,
      cache: await this.cacheAPIService.getAll(page, size),
    };
  }

  /**
   * Add an endpoint that removes a given key from the cache.
   */
  @Delete('keys/:key')
  async removeKey(@Param('key') key: string) {
    const cache = await this.cacheAPIService.getCacheByKey(key);
    if (!cache) {
      throw new BadRequestException('Please send a valid key');
    }
    this.cacheAPILogger.log(`Removing cache with key ${key}`);
    return this.cacheAPIService.removeCacheByKey(key);
  }

  /**
   * Add an endpoint that removes all keys from the cache.
   */
  @Delete('keys')
  async removeAllKeys() {
    this.cacheAPILogger.log('Removing all the keys');
    await this.cacheAPIService.removeAll();
  }
}
