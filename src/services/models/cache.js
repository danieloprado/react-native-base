import { Observable } from 'rxjs/Observable';

import { ServiceError } from '../errors/serviceError';

export class Cache {
  constructor(settings, apiService, logService, storageService) {
    this.connected = false;

    this.settings = settings;
    this.apiService = apiService;
    this.logService = logService;
    this.storageService = storageService;

    setTimeout(() => {
      this.api.connection().subscribe(isConnected => {
        this.connected = isConnected;
      });
    });
  }

  from(key, stream$, refresh = false) {
    key = 'church-cache-' + key;

    return new Observable(observer => {

      this.getData(key).subscribe(cache => {
        if (!cache && !this.connected) {
          observer.error(new ServiceError('empty-cache'));
          observer.complete();
          return;
        }

        if (cache && (!refresh || !this.connected)) {
          observer.next(cache.data);
        }

        if (this.connected && (refresh || !cache || this.isExpirated(cache))) {
          stream$.subscribe({
            next: data => this.saveData(key, data).subscribe(cache => {
              observer.next(cache.data);
              observer.complete();
            }, err => observer.error(err)),
            error: error => {
              if (refresh && cache && this.connected) {
                observer.next(cache.data);
              }

              observer.error(error);
            }
          });
          return;
        }

        observer.complete();
      }, err => observer.error(err));
    }).do(
      data => this.logService.breadcrumb('Cache', 'manual', data),
      err => this.logService.breadcrumb('Cache Error', 'manual', err)
      );
  }

  isExpirated(cache) {
    if (this.settings.isDevelopment) return true;

    const difference = Date.now() - new Date(cache.createdAt).getTime();
    return (difference / 1000 / 60) > 5; //5 minutes
  }

  getData(key) {
    return this.storageService.get(key);
  }

  saveData(key, data) {
    return this.storageService.set(key, { createdAt: new Date(), data });
  }

  clear() {
    return this.storageService.clear(/^church-cache/gi);
  }

}