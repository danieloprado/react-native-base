import { Observable } from 'rxjs/Observable';
import { NetInfo } from 'react-native';
import settings from '../settings';
import storage from './storage';

export class EmptyCache extends Error {}

export class Cache {
  constructor(storage, settings) {
    this.settings = settings;
    this.storage = storage;
    this.connected = false;

    NetInfo.isConnected.addEventListener('change', isConnected => {
      this.connected = isConnected;
    });
  }

  from(key, stream$, refresh = false) {
    return Observable.create(observer => {

      this.getData(key).subscribe(cache => {
        if (!cache && !this.connected) {
          observer.error(new EmptyCache('empty-cache'));
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
            }),
            error: error => observer.error(error)
          });
          return;
        }

        observer.complete();
      });

    });
  }

  isExpirated(cache) {
    if (this.settings.env === 'development') return true;

    const difference = Date.now() - new Date(cache.createdAt).getTime();
    return (difference / 1000 / 60) > 5; //5 minutes
  }

  getData(key) {
    return this.storage.get(key);
  }

  saveData(key, data) {
    return this.storage.set(key, { createdAt: new Date(), data });
  }

}

export default new Cache(storage, settings);