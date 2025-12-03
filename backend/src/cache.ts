import NodeCache from 'node-cache';
import { config } from './config';

interface CachedItem<T> {
  data: T;
  fetchedAt: number;
}

class CacheService {
  private cache: NodeCache;

  constructor(ttlSeconds: number) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  get<T>(key: string): CachedItem<T> | undefined {
    return this.cache.get<CachedItem<T>>(key);
  }

  set<T>(key: string, data: T): boolean {
    const item: CachedItem<T> = {
      data,
      fetchedAt: Date.now(),
    };
    return this.cache.set(key, item);
  }

  stats() {
    return this.cache.getStats();
  }
}

export const aocCache = new CacheService(config.cache.ttl);
