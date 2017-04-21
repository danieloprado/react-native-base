import { BehaviorSubject } from 'rxjs/Rx';
import storage from './storage';

class TokenService {
  constructor(storage) {
    this.storage = storage;

    this.authToken$ = new BehaviorSubject(null);
    this.storage.get('authToken').subscribe(token => {
      this.token = token;
      this.authToken$.next(token);
    });
  }

  getToken() {
    return this.authToken$;
  }

  setToken(token) {
    return this.storage.set('authToken', token).do(() => {
      this.token = token;
      this.authToken$.next(token);
    });
  }

  clearToken() {
    return this.setToken(null).map(() => null);
  }

  setAccessToken(accessToken) {
    this.token.accessToken = accessToken;
    return this.storage.set('authToken', this.token).do(() => {
      this.authToken$.next(this.token);
    });
  }

  isAuthenticated() {
    return this.getToken().map(token => !!token);
  }
}

export default new TokenService(storage);