import { AsyncStorage } from 'react-native';
import { Observable } from 'rxjs/Rx';

export class Storage {
  constructor(asyncStorage) {
    this.asyncStorage = asyncStorage;
  }

  get(key) {
    return Observable.fromPromise(async() => {
      const result = await this.asyncStorage.getItem(key);
      return result ? JSON.parse(result) : null;
    });
  }

  set(key, value) {
    return Observable.fromPromise(async() => {
      value = JSON.stringify(value);
      await this.asyncStorage.setItem(key, value);
    });
  }

}

export default new Storage(AsyncStorage);