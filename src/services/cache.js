import { Observable } from 'rxjs/Observable';
import { ServiceError } from '../errors/serviceError';
import api from './api';
import logService from './log';
import settings from '../settings';
import storage from './storage';

export class Cache {
  constructor() {
    this.connected = false;

    setTimeout(() => {
      api.connection().subscribe(isConnected => {
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
      data => logService.breadcrumb('Cache', 'manual', data),
      err => logService.breadcrumb('Cache Error', 'manual', err)
      );
  }

  isExpirated(cache) {
    if (settings.isDevelopment) return true;

    const difference = Date.now() - new Date(cache.createdAt).getTime();
    return (difference / 1000 / 60) > 5; //5 minutes
  }

  getData(key) {
    return storage.get(key);
  }

  saveData(key, data) {
    return storage.set(key, { createdAt: new Date(), data });
  }

  clear() {
    return storage.clear(/^church-cache/gi);
  }

}

export default new Cache();