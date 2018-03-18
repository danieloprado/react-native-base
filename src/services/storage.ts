import { AsyncStorage } from 'react-native';
import { Observable } from 'rxjs';

import { dateFormatter } from '../formatters/date';

export class StorageService {

  public get<T = any>(key: string): Observable<T> {
    return Observable
      .of(true)
      .switchMap(() => Observable.fromPromise(AsyncStorage.getItem(key)))
      .map(data => data ? dateFormatter.parseObj(JSON.parse(data)) : null);
  }

  public set<T = any>(key: string, value: T): Observable<T> {
    return Observable
      .of(true)
      .switchMap(() => Observable.fromPromise(AsyncStorage.setItem(key, JSON.stringify(value))))
      .map(() => value);
  }

  public clear(regexp: RegExp): Observable<void> {
    return Observable
      .fromPromise(AsyncStorage.getAllKeys())
      .switchMap(keys => {
        if (regexp) {
          keys = keys.filter(k => regexp.test(k));
        }

        if (!keys.length) return Observable.of(null);
        return Observable.fromPromise(AsyncStorage.multiRemove(keys));
      });
  }

}

const storageService = new StorageService();
export default storageService;