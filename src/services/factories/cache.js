import { CacheService } from '../models/cache';

export default function cacheFactory(container) {
  return new CacheService(
    container.get('settings'),
    container.get('apiService'),
    container.get('logService'),
    container.get('storageService')
  );
}