import { Container } from '../container';
import { CacheService } from '../models/cache';

export function cacheFactory(container: Container): CacheService {
  return new CacheService(container.get('storageService'));
}