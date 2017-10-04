import { AsyncStorage } from 'react-native';
import { Observable } from 'rxjs/Rx';

import dateFormatter from '../../formatters/date';


export class StorageService {

  get(key) {
    return Observable
      .of(true)
      .switchMap(() => Observable.fromPromise(AsyncStorage.getItem(key)))
      .map(data => data ? dateFormatter.parseObj(JSON.parse(data)) : null);
  }

  set(key, value) {
    return Observable
      .of(true)
      .switchMap(() => Observable.fromPromise(AsyncStorage.setItem(key, JSON.stringify(value))))
      .map(() => value);
  }

  clear(regexp) {
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