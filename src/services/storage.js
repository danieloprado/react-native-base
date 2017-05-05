import { AsyncStorage } from 'react-native';
import { Observable } from 'rxjs/Rx';

export class Storage {

  get(key) {
    return Observable.fromPromise((async() => {
      const result = await AsyncStorage.getItem(key);
      return result ? JSON.parse(result) : null;
    })());
  }

  set(key, value) {
    return Observable
      .fromPromise(AsyncStorage.setItem(key, JSON.stringify(value)))
      .map(() => value);
  }

}

export default new Storage();