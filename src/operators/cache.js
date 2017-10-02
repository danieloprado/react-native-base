import { Observable } from 'rxjs/Observable';

import services from '../services';

Observable.prototype.cache = function (key, refresh) {
  return this.lift(new CacheOperator(key, refresh));
};

class CacheOperator {
  constructor(key, refresh) {
    this.key = key;
    this.refresh = refresh;
    this.apiService = services.get('apiService');
    this.cacheService = services.get('cacheService');
    this.logService = services.get('logService');
  }

  call(subscriber, source) {
    if (this.refresh) {
      return source
        .do(data => this.cacheService.saveData(this.key, data))
        .subscribe(subscriber);
    }

    let currentCache;
    return this.cacheService.getData(this.key)
      .switchMap(cache => {
        currentCache = cache;
        if (cache && !this.cacheService.isExpirated(cache)) {
          return Observable.of(cache.data);
        }

        return !cache ? source : source.startWith(cache.data);
      })
      .do(data => {
        if (currentCache && currentCache.data === data) {
          this.logService.breadcrumb('Cache', 'manual', data);
          return;
        }

        this.logService.breadcrumb('Cache Set', 'manual', data);
        this.cacheService.saveData(this.key, data).map(() => data);
      })
      .subscribe(subscriber);
  }
}