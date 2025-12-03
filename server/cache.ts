import NodeCache from 'node-cache';
import { config } from './config';

class CacheService {
  private cache: NodeCache;

  constructor(ttlSeconds: number) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T): boolean {
    return this.cache.set(key, value);
  }

  stats() {
    return this.cache.getStats();
  }
}

export const aocCache = new CacheService(config.cache.ttl);

