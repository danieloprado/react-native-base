import { AsyncStorage } from 'react-native';
import { Observable } from 'rxjs/Rx';

export class Storage {
  constructor(asyncStorage) {
    this.asyncStorage = asyncStorage;
  }

  get(key) {
    return Observable.fromPromise((async() => {
      const result = await this.asyncStorage.getItem(key);
      return result ? JSON.parse(result) : null;
    })());
  }

  set(key, value) {
    return Observable
      .fromPromise(this.asyncStorage.setItem(key, JSON.stringify(value)))
      .map(() => value);
  }

}

export default new Storage(AsyncStorage);