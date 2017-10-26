import { Observable } from 'rxjs';

import { ICache } from '../../interfaces/cache';
import { ICacheService } from '../interfaces/cache';
import { IStorageService } from '../interfaces/storage';

export class CacheService implements ICacheService {
  private connected: Boolean;
  private memory: { [key: string]: ICache };

  constructor(
    private storageService: IStorageService
  ) {
    this.connected = false;
    this.memory = {};
  }

  public isExpirated(cache: ICache): boolean {
    const difference = Date.now() - new Date(cache.createdAt).getTime();
    return (difference / 1000 / 60) > 5; //5 minutes
  }

  public getData(key: string): Observable<ICache> {
    if (this.memory[key]) return Observable.of(this.memory[key]);
    return this.storageService.get('church-cache-' + key);
  }

  public saveData<T>(key: string, data: T, persist: boolean): Observable<ICache<T>> {
    const cache: ICache<T> = { createdAt: new Date(), data };

    if (persist) {
      return this.storageService.set('church-cache-' + key, cache);
    }

    return Observable.of(true).map(() => {
      this.memory[key] = cache;
      return cache;
    });
  }

  public clear(): Observable<void> {
    return this.storageService.clear(/^church-cache-/gi);
  }

}