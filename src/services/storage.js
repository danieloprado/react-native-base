import { AsyncStorage } from 'react-native';
import { Observable } from 'rxjs/Rx';

export class Storage {

  get(key) {
    return Observable.fromPromise((async () => {
      const result = await AsyncStorage.getItem(key);
      return result ? JSON.parse(result) : null;
    })());
  }

  set(key, value) {
    return Observable
      .fromPromise(AsyncStorage.setItem(key, JSON.stringify(value)))
      .map(() => value);
  }

  clear(regexp) {
    return Observable
      .fromPromise(AsyncStorage.getAllKeys())
      .switchMap(keys => {
        if (regexp) {
          keys = keys.filter(k => regexp.test(k));
        }

        return Observable.fromPromise(AsyncStorage.multiRemove(keys));
      });
  }

}

export default new Storage();